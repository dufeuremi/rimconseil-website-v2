class EditableAPI {
  constructor() {
    this.baseUrl = 'https://backend.rimconseil.com';
    this.token = localStorage.getItem('token');
  }
  
  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }
  
  async get(pageName) {
    try {
      const response = await fetch(`${this.baseUrl}/api/editable-content/${pageName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`No editable content found for page: ${pageName}`, error);
      return { elements: [] };
    }
  }
  
  async save(pageName, selector, html, type = 'paragraph') {
    const response = await fetch(`${this.baseUrl}/api/editable-content/element`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_name: pageName,
        element_selector: selector,
        content_html: html,
        element_type: type
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save: ${response.status}`);
    }
    
    return response.json();
  }

  async bulkUpdate(pageName, updates) {
    const response = await fetch(`${this.baseUrl}/api/editable-content/bulk-update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_name: pageName,
        updates: updates
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to bulk update: ${response.status}`);
    }
    
    return response.json();
  }

  async delete(pageName, selector) {
    // CORRECTION: Utiliser PATCH au lieu de DELETE car la route DELETE n'existe pas
    const response = await fetch(`${this.baseUrl}/api/editable-content/element`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_name: pageName,
        element_selector: selector,
        content_html: '', // Contenu vide pour marquer comme supprimé
        element_type: 'deleted'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.status}`);
    }

    return response.json();
  }

  // Supprimer un bullet point par contenu
  async removeBulletPoint(pageName, selector, itemToRemove) {
    try {
      const data = await this.get(pageName);
      const element = data.elements.find(el => el.element_selector === selector);
      
      if (element) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(element.content_html, 'text/html');
        
        const listItems = doc.querySelectorAll('li');
        listItems.forEach(li => {
          if (li.textContent.includes(itemToRemove)) {
            li.remove();
          }
        });
        
        const newContent = doc.body.innerHTML;
        
        // CORRECTION: Utiliser PATCH via save() au lieu de DELETE
        await this.save(pageName, selector, newContent, 'list');
        
        console.log('✅ Bullet point supprimé');
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  }

  // Supprimer un bullet point par index
  async removeBulletPointByIndex(pageName, selector, index) {
    try {
      const data = await this.get(pageName);
      const element = data.elements.find(el => el.element_selector === selector);
      
      if (element) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(element.content_html, 'text/html');
        
        const listItems = doc.querySelectorAll('li');
        if (listItems[index]) {
          listItems[index].remove();
          
          const newContent = doc.body.innerHTML;
          
          // CORRECTION: Utiliser PATCH via save() au lieu de DELETE
          await this.save(pageName, selector, newContent, 'list');
          
          console.log(`✅ Bullet point à l'index ${index} supprimé`);
          return true;
        } else {
          throw new Error(`Index ${index} non trouvé`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  }

  // Ajouter un bullet point
  async addBulletPoint(pageName, selector, newItem, position = 'end') {
    try {
      const data = await this.get(pageName);
      const element = data.elements.find(el => el.element_selector === selector);
      
      if (element) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(element.content_html, 'text/html');
        
        let list = doc.querySelector('ul, ol');
        if (!list) {
          list = doc.createElement('ul');
          doc.body.appendChild(list);
        }
        
        const newLi = doc.createElement('li');
        newLi.textContent = newItem;
        
        if (position === 'start') {
          list.insertBefore(newLi, list.firstChild);
        } else if (typeof position === 'number') {
          const existingItems = list.querySelectorAll('li');
          if (existingItems[position]) {
            list.insertBefore(newLi, existingItems[position]);
          } else {
            list.appendChild(newLi);
          }
        } else {
          list.appendChild(newLi);
        }
        
        const newContent = doc.body.innerHTML;
        
        await this.save(pageName, selector, newContent, 'list');
        
        console.log('✅ Bullet point ajouté');
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      throw error;
    }
  }

  // Modifier un bullet point
  async updateBulletPoint(pageName, selector, oldText, newText) {
    try {
      const data = await this.get(pageName);
      const element = data.elements.find(el => el.element_selector === selector);
      
      if (element) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(element.content_html, 'text/html');
        
        const listItems = doc.querySelectorAll('li');
        let updated = false;
        
        listItems.forEach(li => {
          if (li.textContent.includes(oldText)) {
            li.textContent = newText;
            updated = true;
          }
        });
        
        if (updated) {
          const newContent = doc.body.innerHTML;
          
          await this.save(pageName, selector, newContent, 'list');
          
          console.log('✅ Bullet point modifié');
          return true;
        } else {
          throw new Error(`Bullet point "${oldText}" non trouvé`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      throw error;
    }
  }

  // Vider toute la liste
  async clearAllBulletPoints(pageName, selector) {
    try {
      await this.save(pageName, selector, '<ul></ul>', 'list');
      
      console.log('✅ Tous les bullet points supprimés');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  }

  // Vérifier si une liste existe
  async listExists(pageName, selector) {
    try {
      const data = await this.get(pageName);
      const element = data.elements.find(el => el.element_selector === selector);
      
      if (element) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(element.content_html, 'text/html');
        const list = doc.querySelector('ul, ol');
        return !!list;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }

  // Compter les bullet points
  async countBulletPoints(pageName, selector) {
    try {
      const data = await this.get(pageName);
      const element = data.elements.find(el => el.element_selector === selector);
      
      if (element) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(element.content_html, 'text/html');
        const listItems = doc.querySelectorAll('li');
        return listItems.length;
      }
      return 0;
    } catch (error) {
      console.error('Erreur:', error);
      return 0;
    }
  }

  // Méthode de compatibilité avec l'ancienne implémentation
  async removeListItemByIndex(pageName, selector, index) {
    return this.removeBulletPointByIndex(pageName, selector, index);
  }
}

export default EditableAPI; 
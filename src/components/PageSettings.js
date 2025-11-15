import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import Button from './Button';
import Input from './Input';
import Text from './Text';
import Textarea from './Textarea';
import StatusToggle from './StatusToggle';
import Dropdown from './Dropdown';
import ConfirmationDialog from './ConfirmationDialog';
import SuccessPopup from './SuccessPopup';
import EditableBlock from './blocks/EditableBlock';
import ImageBlock from './blocks/ImageBlock';
import CoverImageBlock from './CoverImageBlock';
import Block from './blocks/Block';
import './PageSettings.css';

const BLOCK_TYPES = [
  'Titre',
  'Sous-Titre',
  'Texte',
  'Texte 2 col.',
  'Texte 3 col.',
  'Annotation'
];

// Block naming map for semantically naming blocks
const BLOCK_NAME_PREFIX = {
  'Titre': 'title',
  'Sous-Titre': 'subtitle',
  'Texte': 'text',
  'Texte 2 col.': 'text_2col',
  'Texte 3 col.': 'text_3col',
  'Image': 'image',
  'Annotation': 'annotation'
};

const getBlockConfig = (type) => {
  switch (type) {
    case 'Titre':
      return { tag: 'h1', className: 'title', placeholder: 'Écrire un titre...' };
    case 'Sous-Titre':
      return { tag: 'h2', className: 'subtitle', placeholder: 'Écrire un sous-titre...' };
    case 'Texte':
      return { tag: 'div', className: 'text', placeholder: 'Écrire du texte...' };
    case 'Texte 2 col.':
      return { tag: 'div', className: 'text-2-col', placeholder: 'Écrire du texte en 2 colonnes...' };
    case 'Texte 3 col.':
      return { tag: 'div', className: 'text-3-col', placeholder: 'Écrire du texte en 3 colonnes...' };
    case 'Annotation':
      return { tag: 'div', className: 'annotation', placeholder: 'Écrire une annotation...' };
    default:
      return { tag: 'div', className: 'text', placeholder: 'Écrire du texte...' };
  }
};

// Generate a semantic name for a block
const generateBlockName = (type, index) => {
  const prefix = BLOCK_NAME_PREFIX[type] || 'block';
  return `${prefix}_${index + 1}`;
};

// Ajout d'un composant TagsInput interne
function TagsInput({ value = [], onChange, label }) {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => setInput(e.target.value);
  const handleAdd = () => {
    const val = input.trim();
    if (val && !value.includes(val)) {
      onChange([...value, val]);
      setInput('');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      // Supprime le dernier tag si input vide
      onChange(value.slice(0, -1));
    }
  };
  const handleRemove = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontWeight: 500, color: 'var(--color-secondary)', marginBottom: 6, display: 'block' }}>{label}</label>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          background: 'var(--color-white)',
          border: '1px solid var(--color-quaternary)',
          borderRadius: 0,
          padding: '0.5em 0.75em',
          minHeight: 44,
          alignItems: 'center',
          boxShadow: '0 1px 2px rgba(30,40,55,0.03)'
        }}
      >
        {value.map((tag) => (
          <span
            key={tag}
            style={{
              background: 'var(--color-quaternary)',
              color: 'var(--color-secondary)',
              border: '1px solid var(--color-tertiary)',
              borderRadius: 0,
              padding: '0.25em 0.9em 0.25em 0.7em',
              fontSize: '0.97em',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'background 0.2s',
              cursor: 'default',
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              style={{
                marginLeft: 6,
                background: 'none',
                border: 'none',
                color: 'var(--color-tertiary)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1em',
                lineHeight: 1,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
                borderRadius: 0,
              }}
              title="Supprimer"
              onMouseOver={e => (e.currentTarget.style.color = 'var(--color-danger)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--color-tertiary)')}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? 'Ajouter une catégorie' : ''}
          style={{
            minWidth: 90,
            border: 'none',
            outline: 'none',
            fontSize: '1em',
            background: 'transparent',
            color: 'var(--color-secondary)',
            flex: 1,
            padding: '0.3em 0.5em',
            borderRadius: 0,
          }}
        />
      </div>
      <div style={{ fontSize: '0.92em', color: 'var(--color-tertiary)', marginTop: 4 }}>
        Appuyez sur Entrée ou virgule pour ajouter une catégorie.
      </div>
    </div>
  );
}

const PageSettings = ({ onSave, initialData, contentType = 'pages' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blocks, setBlocks] = useState(initialData?.blocks || []);
  const [lastAddedBlockId, setLastAddedBlockId] = useState(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    path: initialData?.path || 'rimconseil.com/',
    date: initialData?.date || '',
    category: initialData?.category || '',
    titre: initialData?.titre || '',
    text_preview: initialData?.text_preview || '',
    img_path: initialData?.img_path || '',
    cover_img_path: initialData?.cover_img_path || '',
    img_file: null,  // Fichier File pour l'image principale
    cover_img_file: null,  // Fichier File pour l'image de couverture
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOnline, setIsOnline] = useState(initialData?.isOnline ?? true);
  const [contentJsonStructure, setContentJsonStructure] = useState({
    metadata: {
      type: contentType,
      id: id || 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    blocks: {}
  });

  // Update content JSON structure when blocks change
  useEffect(() => {
    setContentJsonStructure(prev => {
      const structure = {...prev};
      
      // Update metadata
      structure.metadata = {
        ...structure.metadata,
        updated_at: new Date().toISOString()
      };
      
      // Add content blocks with semantic names
      structure.blocks = {};
      blocks.forEach((block, index) => {
        const blockName = block.name || generateBlockName(block.type, index);
        structure.blocks[blockName] = {
          type: block.type,
          content: block.content,
          order: index
        };
      });
      
      return structure;
    });
  }, [blocks, contentType, id]);

  // Effect to fetch content data
  useEffect(() => {
    if (id && !initialData) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/api/${contentType}/${id}`);
          console.log(`Fetched ${contentType}/${id}:`, response.data);
          
          // Normaliser les données pour le formulaire
          const data = response.data;
          const formattedData = {
            // Support title for pages, titre for actus/articles
            title: contentType === 'pages' ? data.title || '' : data.titre || data.title || '',
            titre: contentType === 'actus' || contentType === 'articles' ? data.titre || data.title || '' : data.title || '',
            path: data.path || '',
            date: data.date || '',
            category: data.category || '',
            text_preview: data.text_preview || '',
            img_path: data.img_path || '',
            cover_img_path: data.cover_img_path || '',
          };
          
          setFormData(formattedData);
          
          // Update online status from backend data
          const onlineStatus = Boolean(
            (data.is_online !== undefined && data.is_online !== null) 
              ? data.is_online === 1 
              : (data.isOnline !== undefined && data.isOnline !== null)
                ? data.isOnline
                : true // default to online if no status found
          );
          setIsOnline(onlineStatus);
          console.log(`Set isOnline status to: ${onlineStatus} (from backend data:`, data.is_online || data.isOnline, ')');
          
          // Parse JSON content if it exists
          if (data.content_json) {
            try {
              let contentData;
              if (typeof data.content_json === 'string') {
                contentData = JSON.parse(data.content_json);
              } else {
                contentData = data.content_json;
              }
              
              console.log('Parsed content_json:', contentData);
              
              // Check if there are blocks to display
              if (contentData && contentData.blocks) {
                // Convert blocks object to array for rendering
                const blocksArray = Object.entries(contentData.blocks)
                  .map(([name, blockData]) => ({
                    id: Date.now() + Math.random(),
                    name,
                    type: blockData.type,
                    content: blockData.content,
                    order: blockData.order || 0,
                    isEditing: false
                  }))
                  .sort((a, b) => a.order - b.order);
                
                setBlocks(blocksArray);
              }
            } catch (parseError) {
              console.error('Error parsing content_json:', parseError);
              setError('Erreur lors du traitement du contenu JSON');
            }
          }
        } catch (err) {
          console.error(`Error fetching ${contentType}/${id}:`, err);
          setError(`Impossible de charger les données pour ${contentType}`);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id, initialData, contentType]);

  useEffect(() => {
    if (lastAddedBlockId) {
      const element = document.querySelector(`[data-block-id="${lastAddedBlockId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        const editableElement = element.querySelector('[contenteditable="true"]');
        if (editableElement) {
          setTimeout(() => {
            editableElement.focus();
          }, 100);
        }
      }
      setLastAddedBlockId(null);
    }
  }, [lastAddedBlockId]);

  const handleChange = (name, value) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Si c'est une image avec un fichier File, stocker séparément
      if (name === 'cover_img_path' && value && typeof value === 'object') {
        if (value.file) {
          // Nouveau fichier uploadé
          updated.cover_img_file = value.file;
          updated.cover_img_path = value.preview; // Pour l'affichage
        } else if (value.remove) {
          // Suppression demandée
          updated.cover_img_file = null;
          updated.cover_img_path = ''; // Chaîne vide = suppression
        }
      }
      
      if (name === 'img_path' && value && typeof value === 'object') {
        if (value.file) {
          // Nouveau fichier uploadé
          updated.img_file = value.file;
          updated.img_path = value.preview; // Pour l'affichage
        } else if (value.remove) {
          // Suppression demandée
          updated.img_file = null;
          updated.img_path = ''; // Chaîne vide = suppression
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    console.log('🚀 Début de la sauvegarde');
    console.log('📋 État formData:', {
      titre: formData.titre,
      img_path: typeof formData.img_path === 'object' ? 'objet' : formData.img_path?.substring(0, 50),
      cover_img_path: typeof formData.cover_img_path === 'object' ? 'objet' : formData.cover_img_path?.substring(0, 50),
      img_file: formData.img_file ? `File: ${formData.img_file.name} (${(formData.img_file.size / 1024).toFixed(0)} KB)` : 'null',
      cover_img_file: formData.cover_img_file ? `File: ${formData.cover_img_file.name} (${(formData.cover_img_file.size / 1024).toFixed(0)} KB)` : 'null'
    });
    
    try {
      // Préparer les données en fonction du type de contenu
      let saveData = {};
      
      if (contentType === 'articles') {
        // Structure spécifique pour les articles selon la documentation API
        saveData = {
          // Inclure uniquement les champs à modifier pour PATCH
          ...(formData.date && { date: formData.date }),
          ...(formData.titre && { titre: formData.titre }),
          ...(formData.text_preview && { text_preview: formData.text_preview }),
          ...(formData.path && { path: formData.path }),
          ...(formData.img_path && { img_path: formData.img_path }),
          ...(formData.cover_img_path && { cover_img_path: formData.cover_img_path }),
          // Ajout du champ category (toujours array)
          category: Array.isArray(formData.category) ? formData.category : (formData.category ? [formData.category] : []),
          content_json: contentJsonStructure, // Pas besoin de JSON.stringify selon la doc API
          is_online: isOnline ? 1 : 0
        };
      } else if (contentType === 'actus') {
        // Structure pour les actualités
        saveData = {
          ...formData,
          category: Array.isArray(formData.category) ? formData.category : (formData.category ? [formData.category] : []),
          content_json: JSON.stringify(contentJsonStructure),
          is_online: isOnline ? 1 : 0
        };
        // S'assurer que le champ 'titre' est utilisé
        saveData.titre = formData.titre || formData.title;
      } else {
        // Structure pour les autres types de contenu
        saveData = {
          ...formData,
          content_json: JSON.stringify(contentJsonStructure),
          is_online: isOnline ? 1 : 0
        };
      }
      
      console.log(`Saving ${contentType} data:`, saveData);
      
      let response;
      
      if (id) {
        // Update existing content
        if (contentType === 'articles' || contentType === 'actus') {
          // Check if we have new image files to upload
          const hasNewImages = formData.img_file || formData.cover_img_file;
          
          if (hasNewImages) {
            // Use FormData for articles/actualités WITH new images
            console.log('📤 Envoi avec FormData (nouvelles images détectées)');
            const uploadFormData = new FormData();
            
            // Add all fields to FormData
            if (saveData.date) uploadFormData.append('date', saveData.date);
            if (saveData.titre) uploadFormData.append('titre', saveData.titre);
            if (saveData.text_preview) uploadFormData.append('text_preview', saveData.text_preview);
            if (saveData.path) uploadFormData.append('path', saveData.path);
            
            // Handle content_json
            if (saveData.content_json) {
              const contentJsonStr = typeof saveData.content_json === 'string' ? saveData.content_json : JSON.stringify(saveData.content_json);
              uploadFormData.append('content_json', contentJsonStr);
              
              // Valider que c'est du JSON valide
              try {
                JSON.parse(contentJsonStr);
                console.log('✅ content_json est valide');
              } catch (e) {
                console.error('❌ content_json invalide:', e);
                throw new Error('Le contenu JSON est invalide');
              }
            }
            
            // Handle category
            if (saveData.category) {
              uploadFormData.append('category', JSON.stringify(saveData.category));
            }
            
            // Handle online status
            if (saveData.is_online !== undefined) {
              uploadFormData.append('is_online', saveData.is_online.toString());
            }
            
            // Add image files if present (using correct field names per backend docs)
            if (formData.img_file) {
              uploadFormData.append('image', formData.img_file);
              console.log(`✅ Ajout image principale: ${formData.img_file.name} (${(formData.img_file.size / 1024 / 1024).toFixed(2)} MB)`);
            }
            
            if (formData.cover_img_file) {
              uploadFormData.append('coverImage', formData.cover_img_file);
              console.log(`✅ Ajout image de couverture: ${formData.cover_img_file.name} (${(formData.cover_img_file.size / 1024 / 1024).toFixed(2)} MB)`);
            }
            
            // Calculate total size
            const totalSize = ((formData.img_file?.size || 0) + (formData.cover_img_file?.size || 0)) / 1024 / 1024;
            console.log('📏 Taille totale des images:', {
              img_file: formData.img_file ? `${(formData.img_file.size / 1024 / 1024).toFixed(2)} MB` : 'aucune',
              cover_img_file: formData.cover_img_file ? `${(formData.cover_img_file.size / 1024 / 1024).toFixed(2)} MB` : 'aucune',
              total: `${totalSize.toFixed(2)} MB`
            });
            
            // Debug: afficher tous les champs du FormData
            console.log('📦 Contenu du FormData:');
            for (let pair of uploadFormData.entries()) {
              if (pair[1] instanceof File) {
                console.log(`  ${pair[0]}: [File] ${pair[1].name} (${(pair[1].size / 1024).toFixed(1)} KB)`);
              } else {
                console.log(`  ${pair[0]}: ${typeof pair[1] === 'string' && pair[1].length > 100 ? pair[1].substring(0, 100) + '...' : pair[1]}`);
              }
            }
            
            console.log(`🔄 Envoi PATCH FormData vers ${API_BASE_URL}/api/${contentType}/${id}`);
            
            const token = localStorage.getItem('token');
            response = await axios.patch(`${API_BASE_URL}/api/${contentType}/${id}`, uploadFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            });
          } else {
            // Use regular JSON for articles/actualités WITHOUT new images
            console.log('📤 Envoi avec JSON (pas de nouvelles images)');
            
            // Validate content_json before sending
            if (saveData.content_json) {
              const contentJsonStr = typeof saveData.content_json === 'string' ? saveData.content_json : JSON.stringify(saveData.content_json);
              try {
                JSON.parse(contentJsonStr);
                console.log('✅ content_json est valide');
              } catch (e) {
                console.error('❌ content_json invalide:', e);
                throw new Error('Le contenu JSON est invalide');
              }
              saveData.content_json = contentJsonStr;
            }
            
            console.log(`🔄 Envoi PATCH JSON vers ${API_BASE_URL}/api/${contentType}/${id}`);
            console.log('📦 Données JSON:', saveData);
            
            response = await axios.patch(`${API_BASE_URL}/api/${contentType}/${id}`, saveData);
          }
        } else {
          // Use JSON for other content types
          const headers = { 'Content-Type': 'application/json' };
          response = await axios.patch(`${API_BASE_URL}/api/${contentType}/${id}`, saveData, { headers });
        }
        
        console.log(`Updated ${contentType}/${id}:`, response.data);
        
        setSuccessMessage('Contenu sauvegardé avec succès !');
        setShowSuccessPopup(true);
      } else {
        // Create new content
        if (contentType === 'articles' || contentType === 'actus') {
          // Use FormData for articles and actualités according to new API
          const uploadFormData = new FormData();
          
          // Add all fields to FormData
          if (saveData.date) uploadFormData.append('date', saveData.date);
          if (saveData.titre) uploadFormData.append('titre', saveData.titre);
          if (saveData.text_preview) uploadFormData.append('text_preview', saveData.text_preview);
          if (saveData.path) uploadFormData.append('path', saveData.path);
          
          // Handle content_json
          if (saveData.content_json) {
            uploadFormData.append('content_json', typeof saveData.content_json === 'string' ? saveData.content_json : JSON.stringify(saveData.content_json));
          }
          
          // Handle category
          if (saveData.category) {
            uploadFormData.append('category', JSON.stringify(saveData.category));
          }
          
          // Handle online status
          if (saveData.is_online !== undefined) {
            uploadFormData.append('is_online', saveData.is_online.toString());
          }
          
          // Handle image files for new content
          if (formData.img_file) {
            console.log('📸 Ajout image principale:', formData.img_file.name);
            uploadFormData.append('image', formData.img_file);
          }
          
          if (formData.cover_img_file) {
            console.log('📸 Ajout image de couverture:', formData.cover_img_file.name);
            uploadFormData.append('coverImage', formData.cover_img_file);
          }
          
          response = await axios.post(`${API_BASE_URL}/api/${contentType}`, uploadFormData);
        } else {
          // Use JSON for other content types
          response = await axios.post(`${API_BASE_URL}/api/${contentType}`, saveData);
        }
        
        console.log(`Created ${contentType}:`, response.data);
        
        setSuccessMessage('Nouveau contenu créé avec succès !');
        setShowSuccessPopup(true);
      }
      
      // Call onSave callback if provided
      if (typeof onSave === 'function') {
        onSave(saveData);
      }

      // Don't navigate automatically - let the user stay on the current page
      // The parent component will handle refreshing the list if needed
    } catch (err) {
      console.error(`Error saving ${contentType}:`, err);
      
      // Créer un message d'erreur détaillé
      let errorMsg = `Erreur lors de la sauvegarde\n\n`;
      
      if (err.response) {
        // Le serveur a répondu avec un code d'erreur
        errorMsg += `📊 Réponse du serveur:\n`;
        errorMsg += `Code HTTP: ${err.response.status}\n`;
        errorMsg += `Message: ${err.response.data?.message || err.response.statusText || 'Aucun message'}\n`;
        errorMsg += `URL: ${err.response.config?.url || 'N/A'}\n`;
        
        if (err.response.data?.error) {
          errorMsg += `Erreur détaillée: ${err.response.data.error}\n`;
        }
        
        if (err.response.data?.details) {
          errorMsg += `\nDétails supplémentaires:\n${JSON.stringify(err.response.data.details, null, 2)}\n`;
        }
        
        // Messages spécifiques selon le code d'erreur
        if (err.response.status === 401) {
          errorMsg += `\n⚠️ Authentification requise. Veuillez vous reconnecter.`;
        } else if (err.response.status === 404) {
          errorMsg += `\n⚠️ ${contentType} non trouvé(e) sur le serveur.`;
        } else if (err.response.status === 400) {
          errorMsg += `\n⚠️ Données invalides envoyées au serveur.`;
        } else if (err.response.status === 413) {
          errorMsg += `\n⚠️ Fichier trop volumineux. Les images sont probablement trop grandes.`;
          errorMsg += `\nSolution: Utilisez des images de taille réduite (< 1 MB recommandé).`;
        } else if (err.response.status === 500) {
          errorMsg += `\n⚠️ Erreur interne du serveur. Contactez l'administrateur.`;
        }
        
      } else if (err.request) {
        // La requête a été envoyée mais aucune réponse reçue
        errorMsg += `🌐 Erreur réseau:\n`;
        errorMsg += `Type: Network Error\n`;
        errorMsg += `Cause probable: Le serveur backend n'est pas accessible OU la requête est trop volumineuse\n`;
        errorMsg += `URL tentée: ${API_BASE_URL}/api/${contentType}${id ? `/${id}` : ''}\n`;
        
        // Détecter si le problème vient probablement des images
        // Vérifier les fichiers File (pas les strings base64)
        const imgFileSize = formData.img_file ? formData.img_file.size : 0;
        const coverFileSize = formData.cover_img_file ? formData.cover_img_file.size : 0;
        const totalImageSize = imgFileSize + coverFileSize;
        
        console.log('📊 Taille des images:', {
          img_file: imgFileSize ? `${(imgFileSize / 1024 / 1024).toFixed(2)} MB` : 'aucune',
          cover_img_file: coverFileSize ? `${(coverFileSize / 1024 / 1024).toFixed(2)} MB` : 'aucune',
          total: `${(totalImageSize / 1024 / 1024).toFixed(2)} MB`
        });
        
        // Si au moins une image > 5 MB ou total > 8 MB
        if (imgFileSize > 5 * 1024 * 1024 || coverFileSize > 5 * 1024 * 1024 || totalImageSize > 8 * 1024 * 1024) {
          errorMsg += `\n🖼️ PROBLÈME DÉTECTÉ: Images trop volumineuses\n`;
          errorMsg += `Taille des images:\n`;
          if (imgFileSize > 0) {
            errorMsg += `• Image principale: ${(imgFileSize / 1024 / 1024).toFixed(2)} MB\n`;
          }
          if (coverFileSize > 0) {
            errorMsg += `• Image de couverture: ${(coverFileSize / 1024 / 1024).toFixed(2)} MB\n`;
          }
          errorMsg += `• Total: ${(totalImageSize / 1024 / 1024).toFixed(2)} MB\n`;
          errorMsg += `\n✅ Solutions:\n`;
          errorMsg += `1. Utilisez des images plus petites (< 3 MB chacune)\n`;
          errorMsg += `2. Compressez vos images avec un outil externe\n`;
          errorMsg += `3. Réduisez la résolution (1200px de largeur max)\n`;
          errorMsg += `4. Convertissez les PNG en JPEG\n`;
        } else {
          errorMsg += `\n⚠️ Vérifications à effectuer:\n`;
          errorMsg += `• Le serveur backend est-il démarré?\n`;
          errorMsg += `• Vérifiez qu'il tourne sur le port 4000\n`;
          errorMsg += `• Vérifiez votre connexion internet\n`;
          errorMsg += `• Vérifiez les paramètres CORS du serveur\n`;
          if (totalImageSize > 0) {
            errorMsg += `\nNote: Tailles des images OK (${(totalImageSize / 1024 / 1024).toFixed(2)} MB total)\n`;
          }
        }
        
      } else {
        // Erreur lors de la préparation de la requête
        errorMsg += `❌ Erreur inattendue:\n`;
        errorMsg += `Message: ${err.message || 'Erreur inconnue'}\n`;
        errorMsg += `Type: ${err.name || 'N/A'}\n`;
        
        if (err.stack) {
          errorMsg += `\nStack trace:\n${err.stack.split('\n').slice(0, 3).join('\n')}`;
        }
      }
      
      console.error('Détails complets de l\'erreur:', errorMsg);
      setErrorMessage(errorMsg);
      setShowErrorMessage(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (blocks.length > 0 && blocks.some(block => block.content)) {
      setShowBackConfirm(true);
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    // Fix the dashboard path for actus to use actualites in the URL
    const dashboardPath = contentType === 'actus' ? '/dashboard/actualites' : `/dashboard/${contentType}`;
    navigate(dashboardPath);
  };

  const handleToggleStatus = async (itemId, newStatus) => {
    if (!id) {
      // Si c'est un nouveau contenu pas encore sauvegardé, juste mettre à jour l'état local
      setIsOnline(newStatus);
      return;
    }

    try {
      // Optimistic update
      setIsOnline(newStatus);

      // Préparer les données de mise à jour comme dans les dashboards
      if (contentType === 'articles' || contentType === 'actus') {
        // Use FormData for articles and actualités according to new API
        const formDataUpdate = new FormData();
        
        if (contentType === 'articles') {
          formDataUpdate.append('date', formData.date || new Date().toISOString().split('T')[0]);
          formDataUpdate.append('titre', formData.titre || formData.title || 'Sans titre');
          formDataUpdate.append('text_preview', formData.text_preview || '');
          formDataUpdate.append('path', formData.path || '');
          
          const categoryData = Array.isArray(formData.category) ? formData.category : (formData.category ? [formData.category] : []);
          formDataUpdate.append('category', JSON.stringify(categoryData));
          
          formDataUpdate.append('content_json', JSON.stringify(contentJsonStructure));
        } else if (contentType === 'actus') {
          formDataUpdate.append('titre', formData.titre || formData.title || 'Sans titre');
          formDataUpdate.append('text_preview', formData.text_preview || '');
          formDataUpdate.append('date', formData.date || new Date().toISOString().split('T')[0]);
          
          const categoryData = Array.isArray(formData.category) ? formData.category : (formData.category ? [formData.category] : []);
          formDataUpdate.append('category', JSON.stringify(categoryData));
          
          formDataUpdate.append('content_json', JSON.stringify(contentJsonStructure));
          
          // Add existing image paths if they exist
          if (formData.img_path) {
            formDataUpdate.append('img_path', formData.img_path);
          }
          if (formData.cover_img_path) {
            formDataUpdate.append('cover_img_path', formData.cover_img_path);
          }
        }
        
        formDataUpdate.append('is_online', newStatus ? '1' : '0');
        
        const response = await axios.patch(`${API_BASE_URL}/api/${contentType}/${id}`, formDataUpdate);
      } else {
        // Use JSON for other content types
        const updateData = {
          ...formData,
          content_json: JSON.stringify(contentJsonStructure),
          is_online: newStatus ? 1 : 0
        };
        
        const headers = { 'Content-Type': 'application/json' };
        const response = await axios.patch(`${API_BASE_URL}/api/${contentType}/${id}`, updateData, { headers });
      }
      
      // Show success message
      setSuccessMessage(`${contentType === 'articles' ? 'Article' : contentType === 'actus' ? 'Actualité' : 'Contenu'} mis ${newStatus ? 'en ligne' : 'hors ligne'} avec succès`);
      setShowSuccessPopup(true);
      
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Revert optimistic update on error
      setIsOnline(!newStatus);
      
      let errorDetails = `Erreur lors de la mise à jour du statut:\n\n`;
      
      if (error.response) {
        errorDetails += `Code d'erreur: ${error.response.status}\n`;
        errorDetails += `Message: ${error.response.data?.message || error.response.statusText}\n`;
        errorDetails += `URL: ${error.response.config?.url}\n`;
        if (error.response.data?.details) {
          errorDetails += `Détails: ${JSON.stringify(error.response.data.details, null, 2)}`;
        }
      } else if (error.request) {
        errorDetails += `Erreur réseau: Impossible de contacter le serveur\n`;
        errorDetails += `URL tentée: ${API_BASE_URL}/api/${contentType}/${id}\n`;
        errorDetails += `Vérifiez que le serveur backend est démarré sur le port 4000`;
      } else {
        errorDetails += `Erreur inattendue: ${error.message}`;
      }
      
      setErrorMessage(errorDetails);
      setShowErrorMessage(true);
    }
  };

  const handleAddBlock = (blockType) => {
    const newBlockId = Date.now();
    const newBlockIndex = blocks.length;
    const newBlockName = generateBlockName(blockType, newBlockIndex);
    
    setBlocks(prev => [...prev, {
      id: newBlockId,
      name: newBlockName,
      type: blockType,
      content: '',
      order: newBlockIndex,
      isEditing: true
    }]);
    
    setLastAddedBlockId(newBlockId);
  };

  const handleDeleteBlock = (blockId) => {
    setBlocks(prev => {
      const updatedBlocks = prev.filter(block => block.id !== blockId);
      // Recalculate order for remaining blocks
      return updatedBlocks.map((block, index) => ({
        ...block,
        order: index
      }));
    });
  };

  const handleBlockContentChange = (blockId, content) => {
    // Mise à jour de l'état blocks
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
    
    // Mise à jour du contentJsonStructure est gérée automatiquement par l'useEffect
  };

  const handleBlockEditingState = (blockId, isEditing) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, isEditing } : block
    ));
  };

  const handleMoveBlock = (blockId, direction) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === blockId);
      if (index === -1) return prev;
      
      const newBlocks = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= newBlocks.length) return prev;
      
      // Swap blocks
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[newIndex];
      newBlocks[newIndex] = temp;
      
      // Update order property for all blocks
      return newBlocks.map((block, idx) => ({
        ...block,
        order: idx
      }));
    });
  };

  // Determine text direction based on block content
  const detectTextDirection = (text) => {
    if (!text) return 'ltr';
    
    // Check for RTL characters (Arabic, Hebrew, etc.)
    const rtlChars = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text) ? 'rtl' : 'ltr';
  };
  
  // Get text direction for this block
  const getTextDirection = (block) => {
    if (block.className.includes('title') || 
        block.className.includes('subtitle') || 
        block.className.includes('text')) {
      return detectTextDirection(block.content);
    }
    return 'ltr';
  };

  const renderBlock = (block, index, array) => {
    if (block.type === 'Image') {
      return (
        <Block 
          key={block.id} 
          onDelete={() => handleDeleteBlock(block.id)}
          onMoveUp={() => handleMoveBlock(block.id, 'up')}
          onMoveDown={() => handleMoveBlock(block.id, 'down')}
          isFirst={index === 0}
          isLast={index === array.length - 1}
          isEditing={block.isEditing}
          data-block-id={block.id}
          blockName={block.name}
        >
          <ImageBlock
            initialImage={block.content}
            onChange={(content) => handleBlockContentChange(block.id, content)}
          />
        </Block>
      );
    }

    const config = getBlockConfig(block.type);
    
    // Special case for title blocks in actus content type
    if (contentType === 'actus' && block.type === 'Titre') {
      // Format the date in French - cette fonction est gardée mais la date ne sera plus affichée
      const formatDateInFrench = (dateString) => {
        if (!dateString) return '';
        
        try {
          const date = new Date(dateString);
          // Options for formatting the date in French
          const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
          };
          
          return date.toLocaleDateString('fr-FR', options);
        } catch (e) {
          console.error('Error formatting date:', e);
          return dateString;
        }
      };
      
      // La date est formatée mais ne sera plus affichée
      const frenchDate = formatDateInFrench(formData.date);
      
      return (
        <Block 
          key={block.id} 
          onDelete={() => handleDeleteBlock(block.id)}
          onMoveUp={() => handleMoveBlock(block.id, 'up')}
          onMoveDown={() => handleMoveBlock(block.id, 'down')}
          isFirst={index === 0}
          isLast={index === array.length - 1}
          isEditing={block.isEditing}
          data-block-id={block.id}
          blockName={block.name}
        >
          <div style={{ position: 'relative' }}>
            <EditableBlock
              {...config}
              initialContent={block.content}
              onChange={(content) => handleBlockContentChange(block.id, content)}
              onEditingChange={(isEditing) => handleBlockEditingState(block.id, isEditing)}
              textDirection={getTextDirection(config)}
            />
            {/* Suppression de l'affichage de la date */}
          </div>
        </Block>
      );
    }
    
    return (
      <Block 
        key={block.id} 
        onDelete={() => handleDeleteBlock(block.id)}
        onMoveUp={() => handleMoveBlock(block.id, 'up')}
        onMoveDown={() => handleMoveBlock(block.id, 'down')}
        isFirst={index === 0}
        isLast={index === array.length - 1}
        isEditing={block.isEditing}
        data-block-id={block.id}
        blockName={block.name}
      >
        <EditableBlock
          {...config}
          initialContent={block.content}
          onChange={(content) => handleBlockContentChange(block.id, content)}
          onEditingChange={(isEditing) => handleBlockEditingState(block.id, isEditing)}
          textDirection={getTextDirection(config)}
        />
      </Block>
    );
  };

  // Handle content deletion
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/${contentType}/${id}`);
      setSuccessMessage(`${contentType === 'actus' ? 'Actualité' : contentType === 'articles' ? 'Article' : 'Page'} supprimé(e) avec succès`);
      setShowSuccessPopup(true);
      
      // Navigate back after deletion with a delay
      setTimeout(() => {
        const dashboardPath = contentType === 'actus' ? '/dashboard/actualites' : `/dashboard/${contentType}`;
        navigate(dashboardPath);
      }, 2500);
    } catch (err) {
      console.error(`Error deleting ${contentType}/${id}:`, err);
      setErrorMessage(`Erreur lors de la suppression: ${err.message}`);
      setShowErrorMessage(true);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Chargement du contenu...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container" style={{ color: 'red', padding: '1rem', background: '#fff8f8', border: '1px solid #ffcdd2', borderRadius: '4px', margin: '1rem 0' }}>
        <h3>Erreur</h3>
        <p>{error}</p>
        <Button onClick={() => navigate(`/dashboard/${contentType}`)}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="page-settings">
      <div className="page-settings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <Text variant="h1">
            {contentType === 'actus' ? 'Actualité' : 
             contentType === 'articles' ? 'Article' : 'Page'}
          </Text>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <StatusToggle 
            isOnline={isOnline}
            onToggle={handleToggleStatus}
            id={id || 'new'}
            description=""
          />
          {id && (
            <button 
              className="delete-text-button" 
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isSaving}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#d32f2f', 
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                opacity: (isDeleting || isSaving) ? '0.5' : '1'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          )}
        <Button 
          variant="primary" 
          className="publish-button"
            onClick={handleSubmit}
            disabled={isSaving || isDeleting}
        >
            {isSaving ? 'Publication...' : 'Publier'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup 
        show={showSuccessPopup} 
        message={successMessage} 
        onHide={() => setShowSuccessPopup(false)}
        duration={2000} // 2 seconds (1 second longer)
      />
      
      {/* Error message dialog */}
      <ConfirmationDialog
        isOpen={showErrorMessage}
        onClose={() => setShowErrorMessage(false)}
        onConfirm={() => setShowErrorMessage(false)}
        title="Erreur"
        confirmText="OK"
        cancelText={null}
        danger={true}
      >
        <div style={{ 
          maxHeight: '500px', 
          overflowY: 'auto', 
          whiteSpace: 'pre-wrap', 
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #dee2e6',
          textAlign: 'left',
          lineHeight: '1.5'
        }}>
          {errorMessage}
        </div>
      </ConfirmationDialog>

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirmation de suppression"
        confirmText={isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
        danger={true}
        isLoading={isDeleting}
      >
        <p>Êtes-vous sûr de vouloir supprimer {contentType === 'actus' ? 'cette actualité' : contentType === 'articles' ? 'cet article' : 'cette page'} ?</p>
        <p style={{ fontWeight: 'bold', color: '#d32f2f' }}>Cette action est irréversible.</p>
      </ConfirmationDialog>
      
      {/* Back confirmation dialog */}
      <ConfirmationDialog
        isOpen={showBackConfirm}
        onClose={() => setShowBackConfirm(false)}
        onConfirm={navigateBack}
        title="Changements non sauvegardés"
        confirmText="Quitter sans sauvegarder"
      >
        <p>Des modifications non sauvegardées seront perdues. Voulez-vous vraiment quitter ?</p>
      </ConfirmationDialog>

      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <Input
            label="Titre"
            value={contentType === 'articles' || contentType === 'actus' ? formData.titre : formData.title}
            onChange={(e) => handleChange(contentType === 'articles' || contentType === 'actus' ? 'titre' : 'title', e.target.value)}
            required
          />
          
          {contentType === 'pages' && (
            <Input
              label="Chemin de la page"
              value={formData.path}
              onChange={(e) => handleChange('path', e.target.value)}
              required
            />
          )}
          
          {(contentType === 'articles' || contentType === 'actus') && (
            <>
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
                required
              />
              
              <Input
                label="Aperçu"
                value={formData.text_preview}
                onChange={(e) => handleChange('text_preview', e.target.value)}
                required
              />
            </>
          )}
          
          {/* Separate implementation for articles */}
          {contentType === 'articles' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
                Image de couverture
              </label>
              <CoverImageBlock
                initialImage={formData.cover_img_path || ''}
                onChange={(imageData) => handleChange('cover_img_path', imageData)}
              />
            </div>
          )}

          {/* Separate implementation for actualités */}
          {contentType === 'actus' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
                Image de couverture
              </label>
              <CoverImageBlock
                initialImage={formData.img_path || ''}
                onChange={(imageData) => handleChange('img_path', imageData)}
              />
            </div>
          )}

          {/* Categories section */}
          {(contentType === 'articles' || contentType === 'actus') && (
            <TagsInput
              label="Catégories"
              value={Array.isArray(formData.category) ? formData.category : (formData.category ? [formData.category] : [])}
              onChange={(newTags) => handleChange('category', newTags)}
            />
          )}
        </div>

        <div className="content-section">
          <h1 className="section-title">Rédaction</h1>
          <div className="blocks-container">
            {blocks.length > 0 ? (
              blocks.map((block, index, array) => renderBlock(block, index, array))
            ) : (
              <div className="empty-blocks-message" style={{ textAlign: 'center', padding: '2rem', color: '#666', backgroundColor: '#fffff', borderRadius: '4px' }}>
                <p>Aucun bloc de contenu. Utilisez le bouton ci-dessous pour ajouter du contenu.</p>
              </div>
            )}
          </div>
          <div className="add-block-button">
            <Dropdown
              trigger={
                <Button variant="secondary">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Ajouter
                </Button>
              }
              items={BLOCK_TYPES}
              onSelect={handleAddBlock}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PageSettings; 
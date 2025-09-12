import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import Button from './Button';
import SuccessPopup from './SuccessPopup';
import ConfirmationDialog from './ConfirmationDialog';
import EditableAPI from '../utils/EditableAPI';

const EditablePageContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const SaveButton = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const EditableContent = styled.div`
  .editable {
    cursor: text;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    padding: 2px;
    border-radius: 4px;
    position: relative;
    
    &:hover {
      border-color: var(--color-primary);
      background: rgba(44, 119, 227, 0.05);
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      background: rgba(44, 119, 227, 0.1);
    }
    
    &[contenteditable="true"] {
      min-height: 1em;
    }

    &.editing-with-toolbar {
      padding-top: 50px;
    }
  }

  .edit-toolbar {
    position: absolute;
    top: -44px;
    left: 0;
    background: var(--color-white);
    border: 1px solid var(--color-tertiary);
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    padding: 6px 10px;
    display: flex;
    gap: 8px;
    align-items: center;
    z-index: 1000;
  }

  .toolbar-btn {
    background: none;
    border: none;
    border-radius: 0;
    padding: 4px 6px;
    cursor: pointer;
    color: var(--color-tertiary);
    display: flex;
    align-items: center;
    transition: all 0.15s ease;
    font-size: 1rem;
    outline: none;

    &:hover, &:focus {
      background: var(--color-quaternary);
      color: var(--color-primary);
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    svg {
      display: block;
      pointer-events: none;
    }
  }

  /* Lien par défaut dans l'éditeur */
  a {
    color: #0066cc !important;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: #004499 !important;
    }
  }

  /* Fond noir spécifique pour la page Enjeux en mode personnalisation */
  &.bg-enjeux-personalize {
    background: #000;
  }
`;

const EditInfo = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: #ff8c00;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0;
  font-size: 0.875rem;
  z-index: 1000;
  font-weight: 500;
`;

const LinkPickerOverlay = styled.div`
  position: fixed;
  z-index: 20000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LinkPickerPopup = styled.div`
  background: #fff;
  border: 1px solid var(--color-tertiary);
  border-radius: 0;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 24px 20px 16px 20px;
  min-width: 520px;
  max-width: 90vw;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const LinkPickerColumns = styled.div`
  display: flex;
  gap: 24px;
`;

const LinkPickerColumn = styled.div`
  flex: 1;
  min-width: 120px;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-secondary);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 66vh;
    overflow-y: auto;
    padding-right: 4px;
  }

  li {
    margin-bottom: 6px;
  }

  button {
    width: 100%;
    background: none;
    border: none;
    border-radius: 0;
    color: var(--color-primary);
    text-align: left;
    padding: 6px 0;
    font-size: 0.98rem;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: var(--color-quaternary);
      color: var(--color-secondary);
    }
  }
`;

const LinkPickerCustom = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;

  input {
    flex: 1;
    padding: 7px 10px;
    border: 1px solid var(--color-quaternary);
    border-radius: 0;
    font-size: 0.97rem;
  }

  button {
    padding: 7px 16px;
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: 0;
    font-size: 0.97rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: var(--color-secondary);
    }
  }
`;

const LinkPickerClose = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

// Popup de sélection de lien (copié d'EditableBlock)
const LinkPickerModal = ({ show, onClose, onSelect }) => {
  const [customUrl, setCustomUrl] = useState('');
  const [articles, setArticles] = useState([]);
  const [actus, setActus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Liste complète des pages publiques
  const pages = [
    { title: 'Accueil', url: '/' },
    { title: 'Expertises', url: '/expertises' },
    { title: 'Services', url: '/services' },
    { title: 'Secteurs', url: '/secteurs' },
    { title: 'Valeurs', url: '/valeurs' },
    { title: 'Pages', url: '/pages' },
    { title: 'Actualités', url: '/actualites' },
    { title: 'Articles', url: '/articles' },
    { title: 'Contact', url: '/contact' },
    { title: 'Connexion', url: '/connexion' },
    { title: 'Rendez-vous', url: '/rendez-vous' },
    { title: 'Mentions légales', url: '/mentions-legales' },
    { title: 'Politique de confidentialité', url: '/politique-confidentialite' },
    { title: 'Équipe', url: '/equipe' },
    { title: 'Réseau', url: '/reseau' },
    { title: 'Enjeux', url: '/enjeux' },
  ];

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get(`${API_BASE_URL}/api/articles`).catch(() => ({ data: [] })),
      axios.get(`${API_BASE_URL}/api/actus`).catch(() => ({ data: [] }))
    ])
      .then(([articlesRes, actusRes]) => {
        setArticles(
          (articlesRes.data || []).map(a => ({
            title: a.titre || a.title || 'Sans titre',
            url: `/articles/${a.id}`
          }))
        );
        setActus(
          (actusRes.data || []).map(a => ({
            title: a.titre || a.title || 'Sans titre',
            url: `/actualites/${a.id}`
          }))
        );
      })
      .catch(() => setError('Erreur lors du chargement des articles ou actus.'))
      .finally(() => setLoading(false));
  }, [show]);

  if (!show) return null;

  return (
    <LinkPickerOverlay onClick={onClose}>
      <LinkPickerPopup onClick={e => e.stopPropagation()}>
        <LinkPickerColumns>
          <LinkPickerColumn>
            <h4>Articles</h4>
            {loading ? <div>Chargement...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
              <ul>
                {articles.map(a => (
                  <li key={a.url}><button type="button" onClick={() => onSelect(a.url)}>{a.title}</button></li>
                ))}
              </ul>
            )}
          </LinkPickerColumn>
          <LinkPickerColumn>
            <h4>Actus</h4>
            {loading ? <div>Chargement...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
              <ul>
                {actus.map(a => (
                  <li key={a.url}><button type="button" onClick={() => onSelect(a.url)}>{a.title}</button></li>
                ))}
              </ul>
            )}
          </LinkPickerColumn>
          <LinkPickerColumn>
            <h4>Pages</h4>
            <ul>
              {pages.map(p => (
                <li key={p.url}><button type="button" onClick={() => onSelect(p.url)}>{p.title}</button></li>
              ))}
            </ul>
          </LinkPickerColumn>
        </LinkPickerColumns>
        <LinkPickerCustom>
          <input 
            type="text" 
            placeholder="Lien personnalisé (https://...)" 
            value={customUrl} 
            onChange={e => setCustomUrl(e.target.value)} 
          />
          <button type="button" onClick={() => customUrl && onSelect(customUrl)}>Ajouter</button>
        </LinkPickerCustom>
        <LinkPickerClose onClick={onClose}>&times;</LinkPickerClose>
      </LinkPickerPopup>
    </LinkPickerOverlay>
  );
};

const EditablePage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);
  const [PageComponent, setPageComponent] = useState(null);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [api] = useState(() => new EditableAPI());

  useEffect(() => {
    // Dynamically import the page component based on pageId
    const loadPageComponent = async () => {
      try {
        let component;
        switch (pageId) {
          case 'home':
            component = await import('./EditableHome');
            break;
          case 'expertises':
            component = await import('./EditableExpertises');
            break;
          case 'services':
            component = await import('./EditableServices');
            break;
          case 'secteurs':
            component = await import('../pages/Secteurs');
            break;
          case 'valeurs':
            component = await import('./EditableValeurs');
            break;
          case 'enjeux':
            component = await import('./EditableEnjeux');
            break;
          case 'equipe':
            component = await import('./EditableEquipe');
            break;
          case 'reseau':
            component = await import('./EditableReseau');
            break;
          case 'contact':
            component = await import('./EditableContact');
            break;
          default:
            navigate('/dashboard/personnalisation');
            return;
        }
        setPageComponent(() => component.default);
      } catch (error) {
        console.error('Error loading page component:', error);
        navigate('/dashboard/personnalisation');
      }
    };

    loadPageComponent();
  }, [pageId, navigate]);

  useEffect(() => {
    // Load saved data and make all text elements editable after component mounts
    const loadSavedDataAndMakeEditable = async () => {
      // Only target text elements within the main content area
      const mainContent = document.querySelector('.main-content');
      if (!mainContent) return;
      
      // First, load saved data from API
      try {
        const data = await api.get(pageId);
        if (data?.elements?.length) {
          data.elements.forEach(item => {
            const element = document.querySelector(item.element_selector);
            if (element) {
              if (item.element_type === 'deleted') {
                element.style.display = 'none';
                return;
              }
              
              // Handle different types of elements
              if (item.element_type === 'link') {
                // For links, update the href attribute
                const anchor = element.closest('a') || element;
                if (anchor && typeof item.content_html === 'string') {
                  anchor.setAttribute('href', item.content_html);
                }
              } else {
                // For other elements, update the innerHTML
                const target = element.querySelector('.editable-target') || element;
                target.innerHTML = item.content_html;
              }
            }
          });
        }
      } catch (error) {
        console.warn('Could not load saved data:', error);
      }
      
      // Then make elements editable
      const textElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], div[class*="title"], div[class*="description"]');
      
      textElements.forEach(element => {
        // Skip elements that are already editable or contain other elements
        if (element.contentEditable === 'true' || element.children.length > 0) return;
        
        // Skip elements that are likely navigation, buttons, or structural
        const parentClasses = element.parentElement?.className || '';
        const elementClasses = element.className || '';
        
        if (
          parentClasses.includes('nav') ||
          elementClasses.includes('nav') ||
          elementClasses.includes('button') ||
          element.tagName === 'BUTTON' ||
          element.closest('button') ||
          element.closest('nav') ||
          // Exclude edit controls
          element.closest('[class*="EditInfo"]') ||
          element.closest('[class*="SaveButton"]')
        ) return;

        element.classList.add('editable');
        element.contentEditable = true;
        
        element.addEventListener('input', () => {
          setHasChanges(true);
          applyLinkStyles(element);
        });
        
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            element.blur();
          }
        });

        element.addEventListener('focus', () => {
          setActiveElement(element);
          element.classList.add('editing-with-toolbar');
          addToolbarToElement(element);
        });

        element.addEventListener('blur', (e) => {
          // Delay to allow toolbar interactions
          setTimeout(() => {
            if (!document.querySelector('.edit-toolbar:hover') && !showLinkPopup) {
              element.classList.remove('editing-with-toolbar');
              // Remove toolbar
              const toolbar = element.querySelector('.edit-toolbar');
              if (toolbar) {
                toolbar.remove();
              }
              setActiveElement(null);
              // Save the element when it loses focus
              saveElement(element);
            }
          }, 100);
        });

        element.addEventListener('mouseup', saveSelection);
        element.addEventListener('keyup', saveSelection);
      });
    };

    // Delay to ensure the page component is fully rendered
    const timer = setTimeout(loadSavedDataAndMakeEditable, 500);
    
    return () => clearTimeout(timer);
  }, [PageComponent, pageId, api]);

  // Fonctions utilitaires pour l'édition
  const applyLinkStyles = (container) => {
    if (!container) return;
    container.querySelectorAll('a').forEach(link => {
      link.style.color = '#0066cc';
      link.style.textDecoration = 'underline';
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setCurrentSelection(sel.getRangeAt(0).cloneRange());
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (currentSelection && sel) {
      sel.removeAllRanges();
      sel.addRange(currentSelection);
    }
  };

  const executeCommand = (command, value = null) => {
    restoreSelection();
    document.execCommand(command, false, value);
    if (activeElement) {
      applyLinkStyles(activeElement);
      setHasChanges(true);
    }
    activeElement?.focus();
  };

  const handleLink = () => {
    saveSelection();
    setShowLinkPopup(true);
  };

  const handleLinkSelect = (url) => {
    setShowLinkPopup(false);
    restoreSelection();
    if (!url) return;
    
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/')) {
      finalUrl = 'http://' + finalUrl;
    }
    executeCommand('createLink', finalUrl);
  };

  const saveElement = async (element) => {
    if (!element || !element.classList.contains('editable')) return;
    
    const content = element.innerHTML;
    const selector = element.className ? `.${element.className.split(' ').join('.')}` : null;
    
    if (selector) {
      try {
        await api.save(pageId, selector, content, 'paragraph');
        setHasChanges(false);
      } catch (error) {
        console.error('Error saving element:', error);
      }
    }
  };

  // Function to add toolbar to element
  const addToolbarToElement = (element) => {
    // Remove existing toolbar
    const existingToolbar = element.querySelector('.edit-toolbar');
    if (existingToolbar) {
      existingToolbar.remove();
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';
    toolbar.innerHTML = `
      <button type="button" class="toolbar-btn" data-command="bold" title="Gras">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 4h8a4 4 0 0 1 0 8H6z"/>
          <path d="M6 12h9a4 4 0 1 1 0 8H6z"/>
        </svg>
      </button>
      <button type="button" class="toolbar-btn" data-command="italic" title="Italique">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="4" x2="10" y2="4"/>
          <line x1="14" y1="20" x2="5" y2="20"/>
          <line x1="15" y1="4" x2="9" y2="20"/>
        </svg>
      </button>
      <button type="button" class="toolbar-btn" data-command="link" title="Lien">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </button>
    `;

    // Add event listeners
    toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const command = btn.getAttribute('data-command');
        if (command === 'link') {
          handleLink();
        } else {
          executeCommand(command);
        }
      });
    });

    element.appendChild(toolbar);
  };

  const handleSave = () => {
    // Here you would typically save the changes to a backend
    console.log('Saving changes...');
    
    // Show success message and navigate back
    setSuccessMessage('Modifications enregistrées avec succès !');
    setShowSuccessPopup(true);
    
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/dashboard/personnalisation');
    }, 2000);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      navigate('/dashboard/personnalisation');
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    navigate('/dashboard/personnalisation');
  };

  if (!PageComponent) {
    return (
      <EditablePageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Chargement...
        </div>
      </EditablePageContainer>
    );
  }

  return (
    <EditablePageContainer>
      <EditInfo>
        Mode edition
        <Button variant="ghost" onClick={handleCancel} style={{ marginLeft: 16, background: '#fff', color: '#ff9800', border: '1px solid #ff9800', fontWeight: 600 }}>
          Retour
        </Button>
      </EditInfo>
      {/* Suppression du bouton Enregistrer et déplacement du bouton Annuler/Retour */}
      {/* <SaveButton>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="ghost" onClick={handleCancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </SaveButton> */}

            <main className="main-content">
        <EditableContent className={pageId === 'enjeux' ? 'bg-enjeux-personalize' : ''}>
          <PageComponent />
        </EditableContent>
        
        <LinkPickerModal 
          show={showLinkPopup} 
          onClose={() => setShowLinkPopup(false)} 
          onSelect={handleLinkSelect} 
        />
      </main>

      {/* Success Popup */}
      <SuccessPopup 
        show={showSuccessPopup} 
        message={successMessage} 
        onHide={() => setShowSuccessPopup(false)}
        duration={2000}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancel}
        title="Modifications non sauvegardées"
        confirmText="Quitter sans sauvegarder"
        cancelText="Continuer l'édition"
        danger={true}
      >
        <p>Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?</p>
        <p style={{ fontWeight: 'bold', color: '#d32f2f' }}>Vos modifications seront perdues.</p>
      </ConfirmationDialog>
    </EditablePageContainer>
  );
};

export default EditablePage; 
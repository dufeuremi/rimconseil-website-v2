import React, { useRef, useEffect, useState } from 'react';
import './EditableBlock.css';
import axios from 'axios';
import { API_BASE_URL } from '../../App';
import Button from '../Button';

const LINK_COLOR = '#0066cc';
const LTR_MARK = '\u200E';

function applyLinkStyles(container) {
  if (!container) return;
  container.querySelectorAll('a').forEach(link => {
    link.style.color = LINK_COLOR;
    link.style.textDecoration = 'underline';
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// Popup de sélection de lien
function LinkPickerPopup({ show, onClose, onSelect }) {
  const [customUrl, setCustomUrl] = useState('');
  const [articles, setArticles] = useState([]);
  const [actus, setActus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Liste complète des pages publiques extraites d'App.js
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
      axios.get(`${API_BASE_URL}/api/articles`),
      axios.get(`${API_BASE_URL}/api/actus`)
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
            url: `/actus/${a.id}`
          }))
        );
      })
      .catch(() => setError('Erreur lors du chargement des articles ou actus.'))
      .finally(() => setLoading(false));
  }, [show]);

  if (!show) return null;

  return (
    <div className="link-picker-popup-overlay" onClick={onClose}>
      <div className="link-picker-popup" onClick={e => e.stopPropagation()}>
        <div className="link-picker-columns">
          <div className="link-picker-column link-picker-scrollable">
              <h4>Articles</h4>
            {loading ? <div>Chargement...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
              <ul>
                {articles.map(a => (
                  <li key={a.url}><button type="button" onClick={() => onSelect(a.url)}>{a.title}</button></li>
                ))}
              </ul>
            )}
            </div>
          <div className="link-picker-column link-picker-scrollable">
            <h4>Actus</h4>
            {loading ? <div>Chargement...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
              <ul>
                {actus.map(a => (
                  <li key={a.url}><button type="button" onClick={() => onSelect(a.url)}>{a.title}</button></li>
                ))}
              </ul>
            )}
          </div>
          <div className="link-picker-column link-picker-scrollable">
            <h4>Pages</h4>
            <ul>
              {pages.map(p => (
                <li key={p.url}><button type="button" onClick={() => onSelect(p.url)}>{p.title}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="link-picker-custom">
          <input type="text" placeholder="Lien personnalisé (https://...)" value={customUrl} onChange={e => setCustomUrl(e.target.value)} />
          <Button type="button" variant="secondary" onClick={() => customUrl && onSelect(customUrl)}>Ajouter</Button>
        </div>
        <button className="link-picker-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

const EditableBlock = ({
  initialContent = '',
  onChange,
  placeholder = 'Rédiger...',
  tag: Tag = 'div',
  className = '',
  onEditingChange,
  textDirection = 'ltr'
}) => {
  const contentRef = useRef(null);
  const selectionRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [content, setContent] = useState(initialContent);

  // Update content when it changes
  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== content) {
      contentRef.current.textContent = content;
    }
  }, [content]);
  
  // Set text direction styles
  useEffect(() => {
    if (contentRef.current) {
      // Set direction explicitly based on the prop
      contentRef.current.style.direction = textDirection;
      contentRef.current.style.unicodeBidi = 'isolate';
      contentRef.current.style.textAlign = textDirection === 'rtl' ? 'right' : 'left';
      
      // Apply direction to all child nodes
      Array.from(contentRef.current.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.style.direction = textDirection;
          node.style.unicodeBidi = 'isolate';
          node.style.textAlign = textDirection === 'rtl' ? 'right' : 'left';
        }
      });
      
      // Apply text direction attribute to the element itself
      contentRef.current.setAttribute('dir', textDirection);
      
      if (placeholder && contentRef.current.textContent === '') {
        contentRef.current.classList.add('is-empty');
      } else {
        contentRef.current.classList.remove('is-empty');
      }
    }
  }, [placeholder, content, textDirection]);

  const handleInput = () => {
    // Set explicit text direction on every input based on the prop
    if (contentRef.current) {
      contentRef.current.style.direction = textDirection;
      contentRef.current.style.unicodeBidi = 'isolate';
      contentRef.current.style.textAlign = textDirection === 'rtl' ? 'right' : 'left';
      
      // Force text direction mode for all text content
      const range = document.createRange();
      const sel = window.getSelection();
      
      // Save current selection
      let savedSelection = null;
      if (sel.rangeCount > 0) {
        savedSelection = sel.getRangeAt(0).cloneRange();
      }
      
      // Apply direction to content
      Array.from(contentRef.current.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            node.style.direction = textDirection;
            node.style.unicodeBidi = 'isolate';
            node.style.textAlign = textDirection === 'rtl' ? 'right' : 'left';
          }
        }
      });
      
      // Restore selection if it existed
      if (savedSelection) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    }
    
    // Store updated content
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    
    // Set the empty class based on content length
    if (contentRef.current.innerText.trim().length === 0) {
      contentRef.current.classList.add('is-empty');
    } else {
      contentRef.current.classList.remove('is-empty');
    }
    
    onChange && onChange(newContent);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      selectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (selectionRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(selectionRef.current);
    }
  };

  const exec = (command, value = null) => {
    restoreSelection();
    document.execCommand(command, false, value);
    handleInput();
    contentRef.current?.focus();
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
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/')) finalUrl = 'http://' + finalUrl;
    exec('createLink', finalUrl);
  };

  // Toolbar UI
  const Toolbar = () => (
    <div className="text-format-popup custom-toolbar">
      <button type="button" className="toolbar-btn" onMouseDown={e => { e.preventDefault(); exec('bold'); }} title="Gras">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 1 1 0 8H6z"/></svg>
      </button>
      <button type="button" className="toolbar-btn" onMouseDown={e => { e.preventDefault(); exec('italic'); }} title="Italique">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </button>
      <button type="button" className="toolbar-btn" onMouseDown={e => { e.preventDefault(); handleLink(); }} title="Lien">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </button>
    </div>
  );
    
  // Appliquer le style aux liens même après un collage
  useEffect(() => {
    const handler = () => applyLinkStyles(contentRef.current);
    contentRef.current?.addEventListener('paste', handler);
    return () => contentRef.current?.removeEventListener('paste', handler);
  }, []);

  return (
    <div className="editable-block-container" style={{ position: 'relative', width: '100%' }}>
      <Toolbar />
      <Tag
        ref={contentRef}
        className={`editable-block ${className} ${isEditing ? 'is-editing' : ''}`}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onFocus={() => { setIsEditing(true); onEditingChange && onEditingChange(true); }}
        onBlur={() => { setIsEditing(false); onEditingChange && onEditingChange(false); }}
        onInput={handleInput}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        style={{ 
          direction: textDirection,
          textAlign: textDirection === 'rtl' ? 'right' : 'left'
        }}
      />
      <LinkPickerPopup show={showLinkPopup} onClose={() => setShowLinkPopup(false)} onSelect={handleLinkSelect} />
    </div>
  );
};

export default EditableBlock; 
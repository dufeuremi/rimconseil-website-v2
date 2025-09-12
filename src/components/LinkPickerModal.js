import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../App';

const overlayStyle = {
  position: 'fixed',
  zIndex: 20000,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const popupStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 0,
  width: '800px',
  maxWidth: '90vw',
  maxHeight: '80vh',
  overflow: 'auto',
  padding: '16px',
  position: 'relative',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
};

const columnsStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start'
};

const columnStyle = { flex: 1, minWidth: 0 };
const listStyle = { listStyle: 'none', padding: 0, margin: 0 };
const buttonItemStyle = { background: 'none', border: '1px solid #e5e7eb', padding: '6px 8px', marginBottom: '6px', width: '100%', textAlign: 'left', cursor: 'pointer' };

const footerStyle = { display: 'flex', gap: '8px', marginTop: '12px' };
const inputStyle = { flex: 1, border: '1px solid #e5e7eb', padding: '8px 10px' };
const addBtnStyle = { border: '1px solid #e5e7eb', padding: '8px 12px', background: 'var(--color-quaternary, #f5f7fb)', cursor: 'pointer' };
const closeBtnStyle = { position: 'absolute', top: 8, right: 10, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#999' };

const LinkPickerModal = ({ show, onClose, onSelect }) => {
  const [customUrl, setCustomUrl] = useState('');
  const [articles, setArticles] = useState([]);
  const [actus, setActus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    { title: 'Enjeux', url: '/enjeux' }
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
            url: `/actualites/${a.id}`
          }))
        );
      })
      .catch(() => setError("Erreur lors du chargement des articles ou actus."))
      .finally(() => setLoading(false));
  }, [show]);

  if (!show) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: 0, marginBottom: 12, color: 'var(--color-secondary)' }}>Choisir un lien</h3>
        <div style={columnsStyle}>
          <div style={columnStyle}>
            <h4 style={{ marginTop: 0 }}>Articles</h4>
            {loading ? <div>Chargement...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
              <ul style={listStyle}>
                {articles.map(a => (
                  <li key={a.url}><button type="button" style={buttonItemStyle} onClick={() => onSelect(a.url)}>{a.title}</button></li>
                ))}
              </ul>
            )}
          </div>
          <div style={columnStyle}>
            <h4 style={{ marginTop: 0 }}>Actus</h4>
            {loading ? <div>Chargement...</div> : error ? <div style={{color:'red'}}>{error}</div> : (
              <ul style={listStyle}>
                {actus.map(a => (
                  <li key={a.url}><button type="button" style={buttonItemStyle} onClick={() => onSelect(a.url)}>{a.title}</button></li>
                ))}
              </ul>
            )}
          </div>
          <div style={columnStyle}>
            <h4 style={{ marginTop: 0 }}>Pages</h4>
            <ul style={listStyle}>
              {pages.map(p => (
                <li key={p.url}><button type="button" style={buttonItemStyle} onClick={() => onSelect(p.url)}>{p.title}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={footerStyle}>
          <input type="text" placeholder="Lien personnalisé (https://...)" value={customUrl} onChange={e => setCustomUrl(e.target.value)} style={inputStyle} />
          <button type="button" style={addBtnStyle} onClick={() => customUrl && onSelect(customUrl)}>Ajouter</button>
        </div>
        <button onClick={onClose} style={closeBtnStyle}>&times;</button>
      </div>
    </div>
  );
};

export default LinkPickerModal; 
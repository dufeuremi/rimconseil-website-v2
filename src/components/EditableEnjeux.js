import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Title from './Title';
import EnjeuxCard from './EnjeuxCard';
import EditableAPI from '../utils/EditableAPI';
import LinkPickerModal from './LinkPickerModal';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem 2rem;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;

  h1, h2, h3, h4, h5, h6, .title, .page-title {
    color: #fff !important;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #fff;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  overflow: hidden;
  padding: 2rem 1.5rem;
  background: #000; /* Only cards area is black in personalization */
  border-radius: 0;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EditableElement = ({ selector, type, children, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const contentRef = useRef(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  const derivedClassName = selector
    ? (selector.startsWith('.') ? selector.slice(1) : selector).replace(/[^a-zA-Z0-9_-]/g, '')
    : '';

  const saveSelection = () => { const sel = window.getSelection(); if (sel && sel.rangeCount > 0) setCurrentSelection(sel.getRangeAt(0).cloneRange()); };
  const restoreSelection = () => { const sel = window.getSelection(); if (currentSelection && sel) { sel.removeAllRanges(); sel.addRange(currentSelection); } };
  const exec = (cmd, value = null) => { restoreSelection(); document.execCommand(cmd, false, value); contentRef.current?.focus(); };

  const handleLinkInsert = (url) => {
    setShowLinkPopup(false);
    restoreSelection();
    if (!url) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/')) finalUrl = 'http://' + finalUrl;
    exec('createLink', finalUrl);
  };

  return (
    <div style={{ position: 'relative' }}>
      {showToolbar && (
        <div style={{ position: 'absolute', top: -44, left: 0, background: '#fff', border: '1px solid #ddd', borderRadius: 4, padding: '6px 10px', display: 'flex', gap: 8, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <button onMouseDown={(e)=>{e.preventDefault(); exec('bold');}} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px' }} title="Gras"><strong>B</strong></button>
          <button onMouseDown={(e)=>{e.preventDefault(); exec('italic');}} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px' }} title="Italique"><em>I</em></button>
          <button onMouseDown={(e)=>{e.preventDefault(); saveSelection(); setShowLinkPopup(true);}} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px' }} title="Lien" aria-label="Ajouter un lien">🔗</button>
        </div>
      )}
      <div className={`editable ${derivedClassName} ${isEditing ? 'editing' : ''}`} style={{ border: isEditing ? '2px dashed #007bff' : '2px dashed transparent', padding: 4, borderRadius: 4, transition: 'border 0.3s', cursor: 'text', minHeight: '1em' }} onMouseEnter={(e)=>!isEditing && (e.currentTarget.style.borderColor='#007bff')} onMouseLeave={(e)=>!isEditing && (e.currentTarget.style.borderColor='transparent')}>
        {React.isValidElement(children) ? React.cloneElement(children, {}, (
          <span ref={contentRef} className="editable-target" contentEditable suppressContentEditableWarning onFocus={()=>{setIsEditing(true); setShowToolbar(true);}} onBlur={(e)=>{setTimeout(()=>{onSave(selector, e.target.innerHTML, type); setIsEditing(false); setShowToolbar(false);},150);}} onMouseUp={saveSelection} onKeyUp={saveSelection} style={{ outline:'none', display:'inline' }}>
            {children.props.children}
          </span>
        )) : (
          <span ref={contentRef} className="editable-target" contentEditable suppressContentEditableWarning onFocus={()=>{setIsEditing(true); setShowToolbar(true);}} onBlur={(e)=>{setTimeout(()=>{onSave(selector, e.target.innerHTML, type); setIsEditing(false); setShowToolbar(false);},150);}} onMouseUp={saveSelection} onKeyUp={saveSelection} style={{ outline:'none', display:'inline' }}>
            {children}
          </span>
        )}
      </div>

      <LinkPickerModal show={showLinkPopup} onClose={() => setShowLinkPopup(false)} onSelect={handleLinkInsert} />
    </div>
  );
};

const EditableEnjeux = () => {
  const [api] = useState(() => new EditableAPI());
  const [saveNotification, setSaveNotification] = useState(false);
  const [ctaLinks, setCtaLinks] = useState({});
  const [showLinkPicker, setShowLinkPicker] = useState({ key: null });
  const [enjeuxDetails, setEnjeuxDetails] = useState(() => [
    [
      "Accompagnement personnalisé à chaque étape",
      "Intégration des valeurs humaines dans la transformation",
      "Solutions respectueuses de l'environnement",
      "Suivi et optimisation continue"
    ],
    [
      "Stratégies d'innovation adaptées à votre secteur",
      "Mise en place de processus respectueux",
      "Optimisation des ressources existantes",
      "Formation et transfert de compétences"
    ],
    [
      "Audit complet de l'existant",
      "Proposition de solutions sur mesure",
      "Implémentation progressive",
      "Mesure de performance et ajustements"
    ],
    [
      "Évaluation de la maturité digitale",
      "Conception d'une feuille de route de transformation",
      "Modernisation des systèmes existants",
      "Accompagnement au changement et formation des équipes"
    ],
    [
      "Audit de sécurité et identification des vulnérabilités",
      "Mise en place de solutions de protection adaptées",
      "Conformité RGPD et autres réglementations",
      "Formation des équipes aux bonnes pratiques de sécurité"
    ],
    [
      "Analyse des performances actuelles",
      "Optimisation des infrastructures et applications",
      "Automatisation des processus IT",
      "Réduction des coûts et amélioration de l'efficacité opérationnelle"
    ]
  ]);

  const enjeuxData = [
    { title: "Nom de l'enjeux", description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.", link: "/contact" },
    { title: "Nom de l'enjeux", description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.", link: "/contact" },
    { title: "Nom de l'enjeux", description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.", link: "/contact" },
    { title: 'Transformation digitale', description: "Accompagner votre entreprise dans sa transformation numérique avec des solutions adaptées à vos besoins.", link: "/contact" },
    { title: 'Sécurité des données', description: "Protéger vos informations sensibles avec des stratégies de sécurité robustes et conformes aux réglementations.", link: "/contact" },
    { title: 'Performance IT', description: "Optimiser vos infrastructures pour une meilleure performance et une réduction des coûts opérationnels.", link: "/contact" }
  ];

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const data = await api.get('enjeux');
        const links = {};
        
        data.elements?.forEach(item => {
          const el = document.querySelector(item.element_selector);
          if (el) {
            if (item.element_type === 'link') {
              // Store CTA links for buttons
              if (item.element_selector.includes('-cta')) {
                links[item.element_selector] = item.content_html;
              }
              
              const anchor = el.closest('a') || el;
              if (anchor && typeof item.content_html === 'string') {
                anchor.setAttribute('href', item.content_html);
              }
            } else {
              const target = el.querySelector('.editable-target') || el;
              target.innerHTML = item.content_html;
            }
          }
        });
        
        setCtaLinks(links);
      } catch {}
    };
    const t = setTimeout(loadExisting, 400);
    return () => clearTimeout(t);
  }, [api]);

  const save = async (selector, html, type) => {
    try {
      await api.save('enjeux', selector, html, type);
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1600);
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const saveLink = async (selector, href) => {
    try {
      await api.save('enjeux', selector, href, 'link');
      setCtaLinks(prev => ({ ...prev, [selector]: href }));
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1600);
    } catch {
      alert('Erreur lors de la sauvegarde du lien');
    }
  };

  const handleAddEnjeuxDetail = async (cardIndex) => {
    setEnjeuxDetails(prev => {
      const copy = prev.map(details => [...details]);
      copy[cardIndex].push('Nouveau point de détail');
      return copy;
    });

    const newIndex = enjeuxDetails[cardIndex].length;
    const selector = `.enjeu-${cardIndex}-detail-${newIndex}`;
    
    try {
      await api.save('enjeux', selector, 'Nouveau point de détail', 'paragraph');
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1600);
    } catch (e) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleRemoveEnjeuxDetail = async (cardIndex, detailIndex) => {
    const selector = `.enjeu-${cardIndex}-detail-${detailIndex}`;
    
    // Hide the element immediately in the UI
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'none';
    }
    
    try {
      await api.delete('enjeux', selector);
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1600);
    } catch (e) {
      console.error('Erreur lors de la suppression:', e);
      alert('Erreur lors de la suppression');
      if (element) {
        element.style.display = '';
      }
    }
  };

  return (
    <PageContainer>
      {saveNotification && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'var(--color-success, #4CAF50)', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px rgba(44,119,227,0.10)', letterSpacing: '0.5px', zIndex: 9999 }}>
          Sauvegardé
        </div>
      )}

      <TitleContainer>
        <EditableElement selector=".enjeux-title" type="title" onSave={save}>
          <Title level={1} align="center">Vos enjeux</Title>
        </EditableElement>
      </TitleContainer>

      <EditableElement selector=".enjeux-description" type="paragraph" onSave={save}>
        <PageDescription>
          Comprendre vos enjeux pour trouver les meilleures solutions.
        </PageDescription>
      </EditableElement>

      <CardsContainer>
        {enjeuxData.map((enjeu, index) => (
          <div key={index}>
            <EnjeuxCard
              title={enjeu.title}
              description={enjeu.description}
              link={enjeu.link}
              details={enjeuxDetails[index] || []}
              index={index}
              classNamePrefix={`enjeu-${index}`}
              ctaLinks={ctaLinks}
              showLinkPicker={showLinkPicker}
              setShowLinkPicker={setShowLinkPicker}
              saveLink={saveLink}
              renderTitle={(defaultEl) => (
                <EditableElement selector={`.enjeu-${index}-title`} type="title" onSave={save}>
                  {defaultEl}
                </EditableElement>
              )}
              renderDescription={(defaultEl) => (
                <EditableElement selector={`.enjeu-${index}-description`} type="paragraph" onSave={save}>
                  {defaultEl}
                </EditableElement>
              )}
              renderButton={(defaultEl) => (
                <EditableElement selector={`.enjeu-${index}-cta`} type="paragraph" onSave={save}>
                  {defaultEl}
                </EditableElement>
              )}
              renderDetail={(defaultEl, detailIndex) => (
                <EditableElement selector={`.enjeu-${index}-detail-${detailIndex}`} type="paragraph" onSave={save}>
                  <div style={{ position: 'relative' }}>
                    {defaultEl}
                    <button
                      type="button"
                      aria-label="Supprimer"
                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveEnjeuxDetail(index, detailIndex); }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '-8px',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-tertiary)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        lineHeight: '20px',
                        padding: 0,
                        opacity: 0.7,
                        transition: 'opacity 0.15s ease',
                        zIndex: 5,
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                    >×</button>
                  </div>
                </EditableElement>
              )}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => handleAddEnjeuxDetail(index)}
                style={{
                  background: 'transparent',
                  color: 'var(--color-primary)',
                  border: '1px dashed var(--color-primary)',
                  borderRadius: 0,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--color-quaternary)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                + Ajouter un détail
              </button>
            </div>
          </div>
        ))}
      </CardsContainer>
      
      {/* Sélecteur de lien */}
      <LinkPickerModal
        show={!!showLinkPicker.key}
        onClose={() => setShowLinkPicker({ key: null })}
        onSelect={(url) => {
          if (showLinkPicker.key) {
            saveLink(showLinkPicker.key, url);
            setShowLinkPicker({ key: null });
          }
        }}
      />
      
      {/* CSS global pour les indicateurs de lien */}
      <style jsx global>{`
        .link-indicator {
          opacity: 0 !important;
        }
        div:hover .link-indicator {
          opacity: 1 !important;
        }
      `}</style>
    </PageContainer>
  );
};

export default EditableEnjeux; 
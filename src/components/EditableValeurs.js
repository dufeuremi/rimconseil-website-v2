import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Title from './Title';
import ValueCard from './ValueCard';
import EditableAPI from '../utils/EditableAPI';
import animation1 from '../assets/animations/animation2.json';
import animation2 from '../assets/animations/animation5.json';
import animation3 from '../assets/animations/animation6.json';
import LinkPickerModal from './LinkPickerModal';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: var(--color-text);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
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

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) setCurrentSelection(sel.getRangeAt(0).cloneRange());
  };
  const restoreSelection = () => {
    const sel = window.getSelection();
    if (currentSelection && sel) { sel.removeAllRanges(); sel.addRange(currentSelection); }
  };
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


// Default data for Value Cards
const defaultValueData = [
  {
    title: 'Valeurs Sociales',
    paragraph: "Placer l'humain au cœur du processus de transformation: (écoute, implication, co-construction, acteurs du changement). Protéger des données individuelles."
  },
  {
    title: 'Valeurs écologiques',
    paragraph: "Infrastructures et équipements responsables (longévité, réparabilité, évolutivité). Gestion sobre des données (collecte optimisée, conservation raisonnée). Optimisation des flux pour réduire l'empreinte énergétique. Conformité réglementaire sur la durée de vie des données."
  },
  {
    title: 'Innovation et pratiques agiles',
    paragraph: "Des architectures IT évolutives. Approches Data centric. Approches agiles et collaboratives."
  }
];

const EditableValeurs = () => {
  const [api] = useState(() => new EditableAPI());
  const [saving, setSaving] = useState(false);
  const [valueDataState, setValueDataState] = useState(() => defaultValueData);

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const data = await api.get('valeurs');

        // Load saved paragraph content
        if (data?.elements?.length) {
          const updatedData = [...defaultValueData];
          data.elements.forEach(item => {
            const m = item.element_selector && item.element_selector.match(/\.valeur-(\d+)-paragraph/);
            if (m && item.element_type === 'paragraph') {
              const vIdx = parseInt(m[1], 10);
              if (vIdx >= 0 && vIdx < updatedData.length) {
                updatedData[vIdx] = { ...updatedData[vIdx], paragraph: item.content_html };
              }
            }
          });
          setValueDataState(updatedData);
        }

        if (data.elements && data.elements.length > 0) {
          data.elements.forEach(item => {
            const element = document.querySelector(item.element_selector);
            if (element) {
              if (item.element_type === 'deleted') {
                element.style.display = 'none';
                return;
              }
              if (item.element_type === 'link') {
                const anchor = element.closest('a') || element;
                if (anchor && typeof item.content_html === 'string') {
                  anchor.setAttribute('href', item.content_html);
                }
              } else {
                const target = element.querySelector('.editable-target') || element;
                target.innerHTML = item.content_html;
              }
            }
          });
        }
        
      } catch (error) {
        console.warn('Could not load existing content:', error);
      }
    };
    const t = setTimeout(loadExisting, 400);
    return () => clearTimeout(t);
  }, [api]);

  const save = async (selector, html, type) => {
    try {
      setSaving(true);
      await api.save('valeurs', selector, html, type);
      
      // Update local state for paragraphs
      const m = selector.match(/\.valeur-(\d+)-paragraph/);
      if (m && type === 'paragraph') {
        const cardIndex = parseInt(m[1], 10);
        setValueDataState(prev => prev.map((item, idx) => 
          idx === cardIndex ? { ...item, paragraph: html } : item
        ));
      }
    } finally {
      setSaving(false);
    }
  };



  const lottieFiles = [animation1, animation2, animation3];

  return (
    <PageContainer>
      {saving && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'var(--color-success, #4CAF50)', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px rgba(44,119,227,0.10)', letterSpacing: '0.5px', zIndex: 9999 }}>
          Sauvegardé
        </div>
      )}
      <Header>
        <EditableElement selector=".valeurs-title" type="title" onSave={save}>
          <Title level={1} align="center">Nos valeurs</Title>
        </EditableElement>
      </Header>
      <EditableElement selector=".valeurs-description" type="paragraph" onSave={save}>
        <PageDescription>
          L'objectif, c'est de fournir du conseil pour des solutions IT responsables qui allient:
        </PageDescription>
      </EditableElement>

      <CardsContainer>
        {valueDataState.map((value, index) => (
          <ValueCard
            key={index}
            lottieFile={lottieFiles[index]}
            title={value.title}
            paragraph={value.paragraph}
            hideDiscoverButton={true}
            classNamePrefix={`valeur-${index}`}
            renderTitle={(defaultEl) => (
              <EditableElement selector={`.valeur-${index}-title`} type="title" onSave={save}>
                {defaultEl}
              </EditableElement>
            )}
            renderParagraph={(defaultEl) => (
              <EditableElement selector={`.valeur-${index}-paragraph`} type="paragraph" onSave={save}>
                {defaultEl}
              </EditableElement>
            )}
          />
        ))}
      </CardsContainer>
      
    </PageContainer>
  );
};

export default EditableValeurs; 
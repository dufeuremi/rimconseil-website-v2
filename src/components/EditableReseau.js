import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Title from './Title';
import Text from './Text';
import EditableAPI from '../utils/EditableAPI';
import LinkPickerModal from './LinkPickerModal';
import partenairesImage from '../assets/images/partenaires.png';
import client1 from '../assets/images/client1.svg';
import client2 from '../assets/images/client2.png';
import excelcioLogo from '../assets/images/excelcio_logo.png';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Description = styled.div`
  max-width: 800px;
  margin: 0 auto 4rem auto;
  text-align: center;
  line-height: 1.6;
`;

const PartnersContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 100%;
`;

const PartnersImage = styled.img`
  max-width: 100%;
  height: auto;

  &.error { display: none; }
`;

const FallbackText = styled.div`
  display: none;
  text-align: center;
  color: var(--color-tertiary);
  padding: 2rem;

  &.visible { display: block; }
`;

const ClientsSection = styled.section`
  margin-top: 5rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const ClientsTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 3rem;
  text-align: center;
`;

const ClientsLogosRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  width: 100%;
  margin: 0 auto;
`;

const EditableElement = ({ selector, type, children, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const contentRef = useRef(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  const derivedClassName = selector ? (selector.startsWith('.') ? selector.slice(1) : selector).replace(/[^a-zA-Z0-9_-]/g, '') : '';

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

const EditableReseau = () => {
  const [api] = useState(() => new EditableAPI());
  const [saveNotification, setSaveNotification] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const data = await api.get('reseau');
        data.elements?.forEach(item => {
          const el = document.querySelector(item.element_selector);
          if (el) {
            const target = el.querySelector('.editable-target') || el;
            target.innerHTML = item.content_html;
          }
        });
      } catch {}
    };
    const t = setTimeout(loadExisting, 400);
    return () => clearTimeout(t);
  }, [api]);

  const save = async (selector, html, type) => {
    try {
      await api.save('reseau', selector, html, type);
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1800);
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <PageContainer>
      {saveNotification && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'var(--color-success, #4CAF50)', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px rgba(44,119,227,0.10)', letterSpacing: '0.5px', zIndex: 9999 }}>
          Sauvegardé
        </div>
      )}

      <Header>
        <EditableElement selector=".reseau-title" type="title" onSave={save}>
          <Title level={1} align="center">Notre réseau</Title>
        </EditableElement>
      </Header>

      <Description>
        <EditableElement selector=".reseau-description" type="paragraph" onSave={save}>
          <Text align="center">
            Rim conseil coopère avec des entreprises partenaires pour diversifier les services proposés. 
            Grâce à notre réseau de partenaires experts dans différents domaines, nous sommes en mesure 
            d'offrir des solutions complètes qui répondent à tous vos besoins informatiques et stratégiques. 
            Cette complémentarité nous permet d'assembler les meilleures compétences pour chaque projet, 
            garantissant ainsi des résultats optimaux et adaptés à votre contexte spécifique.
          </Text>
        </EditableElement>
      </Description>

      <PartnersContainer>
        <PartnersImage 
          src={partenairesImage}
          alt="Nos partenaires: Parteam, Bevoak, Blocnet, Polynom, Colibee, IBM"
          className={imageError ? 'error' : ''}
          onError={() => setImageError(true)}
        />
        <FallbackText className={imageError ? 'visible' : ''}>
          Nos partenaires incluent Parteam, Bevoak, Blocnet, Polynom, Colibee et IBM, qui nous permettent
          d'offrir une gamme complète de services informatiques et stratégiques.
        </FallbackText>
      </PartnersContainer>

      <ClientsSection>
        <EditableElement selector=".reseau-clients-title" type="title" onSave={save}>
          <ClientsTitle>Ils approuvent notre expertise</ClientsTitle>
        </EditableElement>
        <ClientsLogosRow>
          <img src={client1} alt="Client 1" style={{ height: '80px', width: 'auto' }} />
          <img src={client2} alt="Client 2" style={{ height: '80px', width: 'auto' }} />
          <img src={excelcioLogo} alt="Excelcio" style={{ height: '80px', width: 'auto' }} />
        </ClientsLogosRow>
      </ClientsSection>
    </PageContainer>
  );
};

export default EditableReseau; 
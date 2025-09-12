import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Title from './Title';
import Text from './Text';
import EditableAPI from '../utils/EditableAPI';
import LinkPickerModal from './LinkPickerModal';

const ContactContainer = styled.div`
  padding: 8rem 2rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactHeader = styled.div`
  text-align: left;
  margin-bottom: 3rem;
`;

const ContactSubtitle = styled(Text)`
  font-size: 1.125rem;
  max-width: 600px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: 0;
  text-align: left;
`;

const InfoContent = styled.div`
  text-align: left;
  h3 { color: var(--color-secondary); margin-bottom: 0.5rem; text-align: left; }
`;

const EditableElement = ({ selector, type, children, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const contentRef = useRef(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const derivedClassName = selector ? (selector.startsWith('.') ? selector.slice(1) : selector).replace(/[^a-zA-Z0-9_-]/g, '') : '';
  const [showLinkPopup, setShowLinkPopup] = useState(false);
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

const EditableContact = () => {
  const [api] = useState(() => new EditableAPI());
  const [saveNotification, setSaveNotification] = useState(false);

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const data = await api.get('contact');
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
      await api.save('contact', selector, html, type);
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1800);
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <ContactContainer>
      {saveNotification && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'var(--color-success, #4CAF50)', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px rgba(44,119,227,0.10)', letterSpacing: '0.5px', zIndex: 9999 }}>
          Sauvegardé
        </div>
      )}

      <ContactHeader>
        <EditableElement selector=".contact-title" type="title" onSave={save}>
          <Title level={1} align="left">Contactez-nous</Title>
        </EditableElement>
        <EditableElement selector=".contact-subtitle" type="paragraph" onSave={save}>
          <ContactSubtitle>
            Nous vous répondrons dans les plus brefs délais.
          </ContactSubtitle>
        </EditableElement>
      </ContactHeader>

      <InfoGrid>
        <div>
          {/* Form left side stays functional and is not edited here */}
        </div>
        <div>
          <InfoCard>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', color:'var(--color-primary)' }}>📍</div>
            <InfoContent>
              <h3>Adresse</h3>
              <EditableElement selector=".contact-address" type="paragraph" onSave={save}>
                <Text>7 RUE GOUNOD<br />35000 RENNES</Text>
              </EditableElement>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', color:'var(--color-primary)' }}>✉️</div>
            <InfoContent>
              <h3>Email</h3>
              <EditableElement selector=".contact-email" type="paragraph" onSave={save}>
                <Text as="a" href="mailto:info@rimconseil.fr" style={{ textDecoration: 'none' }}>
                  info@rimconseil.fr
                </Text>
              </EditableElement>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', color:'var(--color-primary)' }}>📞</div>
            <InfoContent>
              <h3>Téléphone</h3>
              <EditableElement selector=".contact-phone" type="paragraph" onSave={save}>
                <Text>+33 (0)2 99 00 00 00</Text>
              </EditableElement>
            </InfoContent>
          </InfoCard>
        </div>
      </InfoGrid>
    </ContactContainer>
  );
};

export default EditableContact; 
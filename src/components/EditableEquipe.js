import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Title from './Title';
import TeamMember from './TeamMember';
import ZoneIntervention from './ZoneIntervention';
import intervenantImg from '../assets/images/intervenant1.png';
import EditableAPI from '../utils/EditableAPI';
import LinkPickerModal from './LinkPickerModal';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem 2rem;
  margin-top: 0;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 3.5rem;
  max-width: 800px;
  text-align: left;
`;

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
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

const EditableEquipe = () => {
  const [api] = useState(() => new EditableAPI());
  const [saveNotification, setSaveNotification] = useState(false);

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const data = await api.get('equipe');
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
      await api.save('equipe', selector, html, type);
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1800);
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const teamMembers = [
    {
      name: 'Jean-Philippe Robin',
      role: 'Consultant en organisation et en transformation numérique',
      bio: [
        "Mes expériences passées, à la fois en tant que consultant et manager d'un Département Data et Digital au sein d'une direction de la transformation, me permettent de savoir bien connecter Business, Data et Digital.",
        "En comprenant le business model de mes clients, leur stratégie, leur organisation et leur écosystème, je suis en mesure de mettre en place des stratégies applicatives qui permettent d'allier ce qu'il est utile de faire avec ce qu'il est possible de faire (humainement et techniquement) et d'accompagner et mobiliser les personnes."
      ],
      email: 'info@rimconseil.fr',
      phone: '(FR) 06 11 70 90 16',
      linkedin: 'https://www.linkedin.com',
      image: intervenantImg
    },
    {
      name: 'Loubna Berrado-Robin',
      role: 'Consultante en organisation et en transformation numérique',
      bio: [
        "Études et méthodologies : analyse des projets et proposition de méthodes d'accompagnement adaptées.Audit organisationnel et SI : diagnostic des points faibles et des leviers, évaluation des outils et usages SI, analyse des processus métiers. Transformation numérique : définition du SI cible (stratégie, métier, applicatif), recueil des besoins utilisateurs, modélisation des processus cibles, accompagnement au changement. Plan de transformation SI : élaboration de la feuille de route, rédaction de cahiers des charges et de spécifications fonctionnelles. Mise en œuvre de solutions IT : aide au choix des outils, réalisation des plans de tests, accompagnement à la recette et à la formation des utilisateurs.",
      ],
      email: 'loubna@rimconseil.fr',
      phone: '(FR) 06 01 02 03 04',
      linkedin: 'https://www.linkedin.com'
    }
  ];

  return (
    <PageContainer>
      {saveNotification && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'var(--color-success, #4CAF50)', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px rgba(44,119,227,0.10)', letterSpacing: '0.5px', zIndex: 9999 }}>
          Sauvegardé
        </div>
      )}
      <Header>
        <EditableElement selector=".equipe-title" type="title" onSave={save}>
          <Title level={1} align="center">Notre équipe</Title>
        </EditableElement>
      </Header>
      <EditableElement selector=".equipe-description" type="paragraph" onSave={save}>
        <PageDescription>
          Rim'conseil évolue avec Jean-Philippe Robin, intervenant au service de votre entreprise et Loubna Berrado-Robin, Consultante en organisation et en transformation numérique.
        </PageDescription>
      </EditableElement>
      
      <TeamContainer>
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            name={member.name}
            role={member.role}
            bio={member.bio}
            email={member.email}
            phone={member.phone}
            linkedin={member.linkedin}
            image={member.image}
            classNamePrefix={`member-${index}`}
            renderName={(defaultEl) => (
              <EditableElement selector={`.member-${index}-name`} type="title" onSave={save}>
                {defaultEl}
              </EditableElement>
            )}
            renderRole={(defaultEl) => (
              <EditableElement selector={`.member-${index}-role`} type="subtitle" onSave={save}>
                {defaultEl}
              </EditableElement>
            )}
            renderBioItem={(defaultEl, bioIndex) => (
              <EditableElement selector={`.member-${index}-bio-${bioIndex}`} type="paragraph" onSave={save}>
                {defaultEl}
              </EditableElement>
            )}
          />
        ))}
      </TeamContainer>
      
      <ZoneIntervention />
    </PageContainer>
  );
};

export default EditableEquipe; 
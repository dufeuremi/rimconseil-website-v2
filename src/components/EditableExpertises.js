import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Title from './Title';
import Text from './Text';
import { API_BASE_URL } from '../App';
import EditableAPI from '../utils/EditableAPI';
import LinkPickerModal from './LinkPickerModal';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem 2rem;
  overflow: visible;
`;

const Section = styled.section`
  margin-bottom: 5rem;
  overflow: visible;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const ApproachText = styled(Text)`
  width: 100%;
  margin-bottom: 4rem;
  line-height: 1.7;
  text-align: left;
`;

const ExpertiseGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
  position: relative;
  padding: 2rem 0;
`;

const ExpertiseBlock = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2.5rem;
  align-items: flex-start;
  position: relative;
  padding: 2rem;
  overflow: visible;
  
  &:nth-child(odd) {
    background-color: var(--color-light-gray, #f5f5f5);
    margin-right: 15%;
  }
  
  &:nth-child(even) {
    background-color: var(--color-light-gray, #f5f5f5);
    margin-left: 15%;
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-left: 0;
    margin-right: 0;
    &:nth-child(even) {
       grid-template-columns: 1fr;
    }
  }
`;

const ExpertiseNumber = styled.span`
  font-size: 6rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
  margin-top: -1rem;
`;

const ExpertiseContent = styled.div`
  grid-column: 2;
  padding-right: 1rem;
  
  @media (max-width: 992px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const ExpertiseTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 2rem;
  text-align: left;
`;

const ParagraphContainer = styled.div`
  text-align: left;
  width: 100%;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  padding: 0;
`;

const PartnersSection = styled.section`
  margin-top: 5rem;
  margin-bottom: 5rem;
  text-align: center;
`;

const PartnersTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 3rem;
  text-align: center;
`;

// Default data to render structure
const defaultExpertiseData = [
  {
    number: '1',
    title: 'Stratégie IT',
    paragraph: "Alignement de vos stratégies IT (DATA, ERP, ...) avec les perspectives d'évolutions de l'activité de votre structure et de son écosystème. Nous analysons votre contexte métier pour garantir que vos systèmes d'information soutiennent efficacement vos objectifs stratégiques et votre croissance. Définition des référentiels structurants et leurs modes de gouvernance. Nous élaborons des cadres de référence solides qui standardisent vos processus IT et établissons des règles claires pour la prise de décision et la gestion des systèmes. Transformation organisationnelle. Nous vous accompagnons dans la refonte de vos structures organisationnelles pour les adapter aux nouveaux enjeux digitaux, en tenant compte de l'aspect humain et des résistances au changement."
  },
  {
    number: '2',
    title: 'Architecture IT',
    paragraph: "Architecture d'entreprise, applicative et de données. Nous concevons des architectures robustes qui alignent systèmes informatiques, processus métiers et stratégie globale, garantissant cohérence et performance de votre écosystème IT. Onprem / Cloud / Hybrid. Nous vous guidons dans le choix et l'implémentation de solutions adaptées à vos besoins, qu'elles soient sur site, dans le cloud ou hybrides, en tenant compte des contraintes de sécurité, performance et coût. Move to Cloud. Nous orchestrons votre migration vers le cloud en minimisant les risques et perturbations, tout en maximisant les bénéfices liés à la flexibilité, l'évolutivité et l'optimisation des coûts."
  },
  {
    number: '3',
    title: 'Analyse de donnée',
    paragraph: "Audit applicatif. Nous évaluons en profondeur vos applications existantes pour identifier les forces, faiblesses et opportunités d'amélioration, vous aidant à prendre des décisions éclairées sur l'évolution de votre patrimoine applicatif. Analyse des flux. Nous cartographions et optimisons les flux de données entre vos systèmes pour éliminer les redondances, réduire les latences et améliorer la fiabilité de vos échanges d'information. Définition de Référentiel MDM. Nous établissons une gestion centralisée de vos données de référence (Master Data Management) pour garantir leur unicité, cohérence et fiabilité à travers tous vos systèmes. Modélisation Data. Nous concevons des modèles de données adaptés à vos besoins métiers, facilitant l'exploitation et l'analyse de vos données, tout en préparant le terrain pour l'intelligence artificielle et le machine learning. Analyse des Pain Points. Nous identifions et adressons les points de friction dans vos processus et systèmes pour améliorer l'expérience utilisateur et l'efficacité opérationnelle."
  }
];

// Editable element wrapper with formatting toolbar and non-destructive edits
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
    contentRef.current?.focus();
  };

  const handleFocus = () => { setIsEditing(true); setShowToolbar(true); };
  const handleBlur = (e) => {
    setTimeout(() => {
      const content = e.target.innerHTML;
      setIsEditing(false);
      setShowToolbar(false);
      onSave(selector, content, type);
    }, 150);
  };

  const handleLinkInsert = (url) => {
    setShowLinkPopup(false);
    restoreSelection();
    if (!url) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/')) finalUrl = 'http://' + finalUrl;
    executeCommand('createLink', finalUrl);
  };

  return (
    <div style={{ position: 'relative' }}>
      {showToolbar && (
        <div style={{
          position: 'absolute', top: '-44px', left: 0, background: '#fff', border: '1px solid #ddd',
          borderRadius: '4px', padding: '6px 10px', display: 'flex', gap: 8, zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <button onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }} title="Gras" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
            <strong>B</strong>
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }} title="Italique" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
            <em>I</em>
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowLinkPopup(true); }} title="Lien" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }} aria-label="Ajouter un lien">
            🔗
          </button>
        </div>
      )}
      <div className={`editable ${derivedClassName} ${isEditing ? 'editing' : ''}`} style={{ border: isEditing ? '2px dashed #007bff' : '2px dashed transparent', padding: 4, borderRadius: 4, transition: 'border 0.3s', cursor: 'text', minHeight: '1em' }} onMouseEnter={(e)=>!isEditing && (e.currentTarget.style.borderColor='#007bff')} onMouseLeave={(e)=>!isEditing && (e.currentTarget.style.borderColor='transparent')}>
        {React.isValidElement(children) ? React.cloneElement(children, {}, (
          <span ref={contentRef} className="editable-target" contentEditable suppressContentEditableWarning onFocus={handleFocus} onBlur={handleBlur} onMouseUp={saveSelection} onKeyUp={saveSelection} style={{ outline:'none', display:'inline' }}>
            {children.props.children}
          </span>
        )) : (
          <span ref={contentRef} className="editable-target" contentEditable suppressContentEditableWarning onFocus={handleFocus} onBlur={handleBlur} onMouseUp={saveSelection} onKeyUp={saveSelection} style={{ outline:'none', display:'inline' }}>
            {children}
          </span>
        )}
      </div>

      <LinkPickerModal show={showLinkPopup} onClose={() => setShowLinkPopup(false)} onSelect={handleLinkInsert} />
    </div>
  );
};


const EditableExpertises = () => {
  const [api] = useState(() => new EditableAPI());
  const [saveNotification, setSaveNotification] = useState(false);
  const [expertiseDataState, setExpertiseDataState] = useState(() => defaultExpertiseData);

  useEffect(() => {
    const loadExistingContent = async () => {
      try {
        const data = await api.get('expertises');
        
        if (data.elements?.length) {
          // Load saved paragraph content
          const updatedData = [...defaultExpertiseData];
          data.elements.forEach(item => {
            const m = item.element_selector && item.element_selector.match(/\.expertise-(\d+)-paragraph/);
            if (m && item.element_type === 'paragraph') {
              const eIdx = parseInt(m[1], 10);
              if (eIdx >= 0 && eIdx < updatedData.length) {
                updatedData[eIdx] = { ...updatedData[eIdx], paragraph: item.content_html };
              }
            }
          });
          setExpertiseDataState(updatedData);

          // Inject saved HTML for other elements
          data.elements.forEach(item => {
            const el = document.querySelector(item.element_selector);
            if (el) {
              if (item.element_type === 'deleted') {
                el.style.display = 'none';
                return;
              }
              if (item.element_type === 'link') {
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
        }
        
      } catch {}
    };
    const t = setTimeout(loadExistingContent, 400);
    return () => clearTimeout(t);
  }, [api]);

  const notify = () => { setSaveNotification(true); setTimeout(() => setSaveNotification(false), 1800); };

  const handleSave = async (selector, content, type) => {
    try {
      await api.save('expertises', selector, content, type);
      
      // Update local state for paragraphs
      const m = selector.match(/\.expertise-(\d+)-paragraph/);
      if (m && type === 'paragraph') {
        const cardIndex = parseInt(m[1], 10);
        setExpertiseDataState(prev => prev.map((item, idx) => 
          idx === cardIndex ? { ...item, paragraph: content } : item
        ));
      }
      
      notify();
    } catch (e) {
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

      <Section>
        <EditableElement selector=".expertises-approach-title" type="title" onSave={handleSave}>
          <SectionTitle level={1}>Notre approche</SectionTitle>
        </EditableElement>
        <EditableElement selector=".expertises-approach-text" type="paragraph" onSave={handleSave}>
          <ApproachText>
            Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers.
          </ApproachText>
        </EditableElement>
      </Section>

      <Section>
        <EditableElement selector=".expertises-section-title" type="title" onSave={handleSave}>
          <SectionTitle level={1}>Nos domaines d'expertise</SectionTitle>
        </EditableElement>
        <ExpertiseGrid>
          {expertiseDataState.map((exp, index) => (
            <ExpertiseBlock key={index}>
              <ExpertiseNumber>{exp.number}</ExpertiseNumber>
              <ExpertiseContent>
                <EditableElement selector={`.expertise-${index}-title`} type="title" onSave={handleSave}>
                  <ExpertiseTitle>{exp.title}</ExpertiseTitle>
                </EditableElement>
                <ParagraphContainer>
                  <EditableElement selector={`.expertise-${index}-paragraph`} type="paragraph" onSave={handleSave}>
                    <Paragraph className={`expertise-${index}-paragraph`}>
                      {exp.paragraph || ''}
                    </Paragraph>
                  </EditableElement>
                </ParagraphContainer>
              </ExpertiseContent>
            </ExpertiseBlock>
          ))}
        </ExpertiseGrid>
      </Section>

      <PartnersSection>
        <EditableElement selector=".expertises-partners-title" type="title" onSave={handleSave}>
          <PartnersTitle>Ils approuvent notre expertise</PartnersTitle>
        </EditableElement>
      </PartnersSection>
      
    </PageContainer>
  );
};

export default EditableExpertises; 
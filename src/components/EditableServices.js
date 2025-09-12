import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Title from './Title';
import Text from './Text';
import ZoneIntervention from './ZoneIntervention';
import clientsImage from '../assets/images/clients.png';
import client1 from '../assets/images/client1.svg';
import client2 from '../assets/images/client2.png';
import procederSvg from '../assets/images/proceder.svg';
import EditableAPI from '../utils/EditableAPI';
import EditableConnectionStatus from './EditableConnectionStatus';
import EditableHelp from './EditableHelp';
import LinkPickerModal from './LinkPickerModal';

// Styled Components (same as original Services.js)
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem 2rem;
  overflow: visible;
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0;
  overflow: visible;
  padding: 2rem 0;

  &.content-section {
    min-height: auto;
    margin-bottom: 5rem;
  }
`;

const IntroContainer = styled.div`
  max-width: 800px;
`;

const IntroRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  justify-content: space-between;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const IntroTextContainer = styled.div`
  flex: 1;
  max-width: 600px;
`;

const IntroImage = styled.img`
  flex: 0 0 auto;
  width: 200px;
  height: auto;
  max-width: 200px;
  object-fit: contain;
  @media (max-width: 900px) {
    width: 150px;
    max-width: 150px;
    margin: 0 auto;
    display: block;
  }
`;

const ServiceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
  position: relative;
  padding: 2rem 0;
`;

const ServiceBlock = styled.div`
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

const ServiceNumber = styled.span`
  font-size: 5rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1;
  margin-top: -1rem;
  opacity: 0.9;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 3.5rem;
    grid-row: 1;
  }
`;

const ServiceContent = styled.div`
  grid-column: 2;
  padding-right: 1rem;
  
  @media (max-width: 992px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 2rem;
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

const ClientsSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 2rem 0;
`;

const ClientsTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 3rem;
  text-align: center;
`;

const ClientsImage = styled.img`
  max-width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
`;

const ZoneInterventionWrapper = styled.div`
  margin: 5rem 0;
`;

// Default data for Service Blocks
const defaultServiceData = [
  {
    number: '1',
    title: 'Cadrage du projet et du besoin',
    paragraph: 'Cadrage des objectifs et du périmètre du projet. Identification résultats attendus du changement. Choix des parties prenantes du projet. Budget prévisionnel du projet. Planification du projet.'
  },
  {
    number: '2',
    title: 'Vision globale et état des lieux du SI',
    paragraph: "Etat des lieux de l'architecture SI et audit du SI et les applicatifs DATA existants. Stratégie et culture actuelle du SI. Diagnostic et audit organisationnel de la DSI. Diagnostic organisationnel, des processus et des méthodes. Evaluation de la dette SI."
  },
  {
    number: '3',
    title: 'Evolution du SI Projet cible',
    paragraph: "Définition du projet cible DATA/ BI (Stratégie, Métier, Applicatif et Infrastructures IT). Accompagnement à l'expression des besoins utilisateurs. Accompagnement à l'évolution des usages, processus et des pratiques. Choix et mise en place d'outils « référentiels d'architecture » et les standards de modélisation. Accompagnement au changement."
  },
  {
    number: '4',
    title: 'Plan de transformation SI',
    paragraph: 'Définition de la trajectoire et de la feuille de route (étapes, livrables, ressources, Planning, Budget). Mise en place des indicateurs de pilotage de la transformation. Pilotage des risques liés à la transformation. Mise en place de la gouvernance. Maîtrise du Run.'
  }
];

// Editable component wrapper with formatting toolbar
const EditableElement = ({ selector, type, children, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const contentRef = useRef(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  // Classe CSS dérivée du sélecteur (ex: ".services-main-title" -> "services-main-title")
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

  const handleLinkInsert = (url) => {
    setShowLinkPopup(false);
    restoreSelection();
    if (!url) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/')) finalUrl = 'http://' + finalUrl;
    document.execCommand('createLink', false, finalUrl);
  };

  const executeCommand = (command, value = null) => {
    restoreSelection();
    document.execCommand(command, false, value);
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    setShowToolbar(true);
  };

  const handleBlur = (e) => {
    // Delay to allow toolbar interactions
    setTimeout(() => {
      const content = e.target.innerHTML;
      setIsEditing(false);
      setShowToolbar(false);
      onSave(selector, content, type);
    }, 200);
  };

  const handleMouseUp = () => {
    if (isEditing) {
      saveSelection();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {showToolbar && (
        <div style={{
          position: 'absolute',
          top: '-44px',
          left: '0',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '6px 10px',
          display: 'flex',
          gap: '8px',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <button
            onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
            title="Gras"
          >
            <strong>B</strong>
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
            title="Italique"
          >
            <em>I</em>
          </button>
          <button
            onMouseDown={(e) => { 
              e.preventDefault(); 
              saveSelection();
              setShowLinkPopup(true);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
            title="Lien"
            aria-label="Ajouter un lien"
          >
            🔗
          </button>
        </div>
      )}
      
      <div
        className={`editable ${derivedClassName} ${isEditing ? 'editing' : ''}`}
        style={{
          border: isEditing ? '2px dashed #007bff' : '2px dashed transparent',
          padding: '4px',
          borderRadius: '4px',
          transition: 'border 0.3s',
          cursor: 'text',
          minHeight: '1em'
        }}
        onMouseEnter={(e) => !isEditing && (e.currentTarget.style.borderColor = '#007bff')}
        onMouseLeave={(e) => !isEditing && (e.currentTarget.style.borderColor = 'transparent')}
      >
        {React.isValidElement(children)
          ? React.cloneElement(children, {}, (
              <span
                ref={contentRef}
                className="editable-target"
                contentEditable
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseUp={handleMouseUp}
                onKeyUp={saveSelection}
                style={{ outline: 'none', display: 'inline' }}
              >
                {children.props.children}
              </span>
            ))
          : (
            <span
              ref={contentRef}
              className="editable-target"
              contentEditable
              suppressContentEditableWarning
              onFocus={handleFocus}
              onBlur={handleBlur}
              onMouseUp={handleMouseUp}
              onKeyUp={saveSelection}
              style={{ outline: 'none', display: 'inline' }}
            >
              {children}
            </span>
          )}
      </div>

      <LinkPickerModal show={showLinkPopup} onClose={() => setShowLinkPopup(false)} onSelect={handleLinkInsert} />
    </div>
  );
};


const EditableServices = ({ onContentChange }) => {
  const [api] = useState(() => new EditableAPI());
  const [saveNotification, setSaveNotification] = useState(false);

  const [serviceDataState, setServiceDataState] = useState(() => defaultServiceData);

  useEffect(() => {
    // Load existing content when component mounts
    const loadExistingContent = async () => {
      try {
        const data = await api.get('services');

        // Load saved paragraph content
        if (data?.elements?.length) {
          const updatedData = [...defaultServiceData];
          data.elements.forEach(item => {
            const m = item.element_selector && item.element_selector.match(/\.service-(\d+)-paragraph/);
            if (m && item.element_type === 'paragraph') {
              const sIdx = parseInt(m[1], 10);
              if (sIdx >= 0 && sIdx < updatedData.length) {
                updatedData[sIdx] = { ...updatedData[sIdx], paragraph: item.content_html };
              }
            }
          });
          setServiceDataState(updatedData);
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
                if (target) {
                  console.log('🔄 Mise à jour du contenu:', { selector: item.element_selector, content: item.content_html }); // Debug
                  target.innerHTML = item.content_html;
                }
              }
            }
          });
          
        }
        
      } catch (error) {
        console.warn('Could not load existing content:', error);
      }
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(loadExistingContent, 500);
    return () => clearTimeout(timer);
  }, [api]);

  const showSaveNotification = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  };

  const handleSave = async (selector, content, type) => {
    console.log('💾 Sauvegarde en cours:', { selector, content, type }); // Debug
    
    try {
      const result = await api.save('services', selector, content, type);
      console.log('✅ Sauvegarde réussie:', result); // Debug
      
      // Update local state for paragraphs
      const m = selector.match(/\.service-(\d+)-paragraph/);
      if (m && type === 'paragraph') {
        const cardIndex = parseInt(m[1], 10);
        setServiceDataState(prev => prev.map((item, idx) => 
          idx === cardIndex ? { ...item, paragraph: content } : item
        ));
      }
      
      showSaveNotification();
      
      if (onContentChange) {
        onContentChange();
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };





  return (
    <>
      {/* <EditableConnectionStatus /> */}
      {/* <EditableHelp /> */}
      
      {saveNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--color-success, #4CAF50)',
          color: 'white',
          padding: '10px 24px',
          borderRadius: '6px',
          zIndex: 9999,
          fontSize: '15px',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(44,119,227,0.10)',
          letterSpacing: '0.5px',
          border: 'none',
        }}>
          Sauvegardé
        </div>
      )}
      
      <PageContainer>
        <Section>
          <IntroRow>
            <IntroTextContainer>
              <EditableElement 
                selector=".services-main-title" 
                type="title"
                onSave={handleSave}
              >
                <Title level={1}>Comment allons-nous procéder ?</Title>
              </EditableElement>
              
              <EditableElement 
                selector=".services-intro-text" 
                type="paragraph"
                onSave={handleSave}
              >
                <Text>
                  Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers.
                </Text>
              </EditableElement>
            </IntroTextContainer>
            <IntroImage src={procederSvg} alt="Procéder illustration" />
          </IntroRow>
        </Section>

        <Section className="content-section">
          <ServiceGrid>
            {serviceDataState.map((service, index) => (
              <ServiceBlock key={index}>
                <ServiceNumber>{service.number}</ServiceNumber>
                <ServiceContent>
                  <EditableElement 
                    selector={`.service-${index}-title`} 
                    type="title"
                    onSave={handleSave}
                  >
                    <ServiceTitle>{service.title}</ServiceTitle>
                  </EditableElement>
                  
                  <ParagraphContainer>
                    <EditableElement selector={`.service-${index}-paragraph`} type="paragraph" onSave={handleSave}>
                      <Paragraph className={`service-${index}-paragraph`}>
                        {service.paragraph || ''}
                      </Paragraph>
                    </EditableElement>
                  </ParagraphContainer>
                </ServiceContent>
              </ServiceBlock>
            ))}
          </ServiceGrid>
        </Section>
        
        <ZoneInterventionWrapper>
          <ZoneIntervention />
        </ZoneInterventionWrapper>
        
        <ClientsSection>
          <EditableElement 
            selector=".clients-title" 
            type="title"
            onSave={handleSave}
          >
            <ClientsTitle>Nos clients</ClientsTitle>
          </EditableElement>
          
          <ClientsImage src={clientsImage} alt="Nos clients" />
        </ClientsSection>

      </PageContainer>
    </>
  );
};

export default EditableServices; 
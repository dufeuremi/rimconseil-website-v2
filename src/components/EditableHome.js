import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from './Button';
import Title from './Title';
import EditableAPI from '../utils/EditableAPI';
import LinkPickerModal from './LinkPickerModal';
import Lottie from 'lottie-react';
import maskAnimation from '../assets/animations/mask.json';

const HomeContainer = styled.div`
  min-height: 100vh;
  margin: 0;
  padding: 0;
`;

const SectionContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  margin: 0;

  &.hero-section {
    padding-top: 0;
    margin-top: 0;
    position: relative;
    overflow: hidden;
  }
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${require('../assets/images/background.png')});
  background-size: cover;
  background-position: center;
  z-index: -1;
  opacity: 1;
`;

const HeroSection = styled.div`
  max-width: 1280px;
  width: 100%;
  padding: 96px 5rem 0 5rem;
  text-align: left;
  margin-top: 0;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 96px 2rem 0 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #fff;
  background: rgba(174, 207, 255, 0.1);
  margin-bottom: 1rem;
  padding: 0px 7px;
  border-radius: 0;
  display: inline-block;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #fff;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
  font-weight: 500;
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
        <div style={{ position: 'absolute', top: -44, left: 0, background: '#fff', border: '1px solid #ddd', borderRadius: 0, padding: '6px 10px', display: 'flex', gap: 8, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <button onMouseDown={(e)=>{e.preventDefault(); exec('bold');}} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px' }} title="Gras"><strong>B</strong></button>
          <button onMouseDown={(e)=>{e.preventDefault(); exec('italic');}} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px' }} title="Italique"><em>I</em></button>
          <button onMouseDown={(e)=>{e.preventDefault(); saveSelection(); setShowLinkPopup(true);}} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px' }} title="Lien" aria-label="Ajouter un lien">🔗</button>
        </div>
      )}

      <div className={`editable ${derivedClassName} ${isEditing ? 'editing' : ''}`} style={{ border: isEditing ? '2px dashed #007bff' : '2px dashed transparent', padding: 4, borderRadius: 0, transition: 'border 0.3s', cursor: 'text', minHeight: '1em' }} onMouseEnter={(e)=>!isEditing && (e.currentTarget.style.borderColor='#007bff')} onMouseLeave={(e)=>!isEditing && (e.currentTarget.style.borderColor='transparent')}>
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


const EditableHome = () => {
  const [api] = useState(() => new EditableAPI());
  const lottieRef = useRef();
  const directionRef = useRef(1);
  const bgRef = useRef();
  const [saveNotification, setSaveNotification] = useState(false);
  const [ctaLinks, setCtaLinks] = useState({});
  const [homeExpertiseData, setHomeExpertiseData] = useState({
    0: 'Alignement IT et évolution de l\'activité. Référentiels et gouvernance. Transformation organisationnelle. Digitalisation des process.',
    1: "Architecture d'entreprise, applicative et de données. Onprem / Cloud / Hybrid. Move to Cloud. Migration et modernisation.",
    2: 'Audit applicatif. Analyse des flux. Définition de Référentiel MDM. Modélisation Data.'
  });

  const handleLottieComplete = () => {
    if (lottieRef.current && lottieRef.current.animationItem) {
      directionRef.current = -directionRef.current;
      lottieRef.current.animationItem.setDirection(directionRef.current);
      lottieRef.current.animationItem.setSpeed(0.5);
      lottieRef.current.animationItem.play();
    }
  };

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const data = await api.get('home');
        // Load saved data while preserving the fixed structure
        if (data?.elements?.length) {
          const links = {};
          const expertiseData = { 
            0: 'Alignement IT et évolution de l\'activité. Référentiels et gouvernance. Transformation organisationnelle. Digitalisation des process.',
            1: "Architecture d'entreprise, applicative et de données. Onprem / Cloud / Hybrid. Move to Cloud. Migration et modernisation.",
            2: 'Audit applicatif. Analyse des flux. Définition de Référentiel MDM. Modélisation Data.'
          };
          
          data.elements.forEach(item => {
            const m = item.element_selector && item.element_selector.match(/\.home-expertise-card-(\d+)-paragraph/);
            if (m) {
              const cIdx = parseInt(m[1], 10);
              
              // Récupérer le contenu du paragraphe
              if (item.element_type === 'paragraph' && item.content_html) {
                expertiseData[cIdx] = item.content_html;
              }
            }
            if (item.element_type === 'link' && typeof item.content_html === 'string') {
              links[item.element_selector] = item.content_html;
            }
          });
          
          setCtaLinks(links);
          setHomeExpertiseData(expertiseData);
        }
        data.elements?.forEach(item => {
          const el = document.querySelector(item.element_selector);
          if (el) {
            if (item.element_type === 'deleted') {
              el.style.display = 'none';
              return;
            }
            const target = el.querySelector('.editable-target') || el;
            target.innerHTML = item.content_html;
          }
        });
      } catch {}
    };
    const t = setTimeout(loadExisting, 400);
    return () => clearTimeout(t);
  }, [api]);

  useEffect(() => {
    const updateMask = () => {
      if (!lottieRef.current) return;
      const svg = lottieRef.current.container?.querySelector('svg');
      if (!svg || !bgRef.current) return;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
      bgRef.current.style.webkitMaskImage = `url('${svgDataUrl}')`;
      bgRef.current.style.maskImage = `url('${svgDataUrl}')`;
      bgRef.current.style.webkitMaskRepeat = 'no-repeat';
      bgRef.current.style.maskRepeat = 'no-repeat';
      bgRef.current.style.webkitMaskSize = '100% 80px';
      bgRef.current.style.maskSize = '100% 80px';
      bgRef.current.style.webkitMaskPosition = 'bottom';
      bgRef.current.style.maskPosition = 'bottom';
    };
    const interval = setInterval(updateMask, 50);
    return () => clearInterval(interval);
  }, []);

  const save = async (selector, html, type) => {
    try {
      console.log('Saving:', { selector, html, type });
      await api.save('home', selector, html, type);
      
      // Mettre à jour l'état local pour les paragraphes de savoir-faire
      const m = selector.match(/\.home-expertise-card-(\d+)-paragraph/);
      if (m && type === 'paragraph') {
        const cardIndex = parseInt(m[1], 10);
        setHomeExpertiseData(prev => ({
          ...prev,
          [cardIndex]: html
        }));
      }
      
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1600);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const saveLink = async (selector, href) => {
    try {
      await api.save('home', selector, href, 'link');
      setCtaLinks(prev => ({ ...prev, [selector]: href }));
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 1600);
    } catch {
      alert('Erreur lors de la sauvegarde du lien');
    }
  };



  return (
    <HomeContainer>
      {saveNotification && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'var(--color-success, #4CAF50)', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px rgba(44,119,227,0.10)', letterSpacing: '0.5px', zIndex: 9999 }}>
          Sauvegardé
        </div>
      )}

      <SectionContainer className="hero-section">
        <BackgroundContainer>
          <BackgroundImage ref={bgRef} />
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100vw', height: '80px', pointerEvents: 'none', zIndex: 2 }}>
            <Lottie
              lottieRef={lottieRef}
              animationData={maskAnimation}
              loop={false}
              autoplay
              onComplete={handleLottieComplete}
              style={{ color: 'white', width: '100vw', height: '100%', transform: 'scaleY(0.165) translateY(2px)', transformOrigin: 'bottom', filter: 'brightness(0.0) invert(1)' }}
              rendererSettings={{ preserveAspectRatio: 'none' }}
              speed={0.5}
            />
          </div>
        </BackgroundContainer>

        <HeroSection>
          <EditableElement selector=".home-hero-subtitle" type="subtitle" onSave={save}>
            <Subtitle className="home-hero-subtitle">Conseil et accompagnement d'entreprise</Subtitle>
          </EditableElement>

          <EditableElement selector=".home-hero-title" type="title" onSave={save}>
            <Title level={1} align="center" variant="page-title" style={{ color: '#fff', fontWeight: 600 }} className="home-hero-title">
              Piloter l'IT avec <span style={{ background: 'linear-gradient(45deg, var(--color-greenlight), var(--color-greendark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sens.</span>
            </Title>
          </EditableElement>

          <EditableElement selector=".home-hero-description" type="paragraph" onSave={save}>
            <Description className="home-hero-description">
              Votre partenaire pour co-construire vos solutions IT responsables qui allient innovation et respect des valeurs écologiques et sociales
            </Description>
          </EditableElement>

          {/* Bouton: texte éditable + lien séparé */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              arrow={true}
              as={Link}
              to={ctaLinks['.home-hero-cta'] || '/services'}
              onClick={(e) => {
                // Empêcher la redirection si on clique sur le texte éditable
                if (e.target.closest('.editable')) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <EditableElement selector=".home-hero-cta" type="paragraph" onSave={save}>
                <span className="home-hero-cta">Voir les services</span>
              </EditableElement>
            </Button>
            
            {/* Indicateur de lien au survol */}
            <div 
              className="link-indicator"
              style={{
                position: 'absolute',
                right: '-2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0,
                transition: 'opacity 0.2s',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: 'var(--color-primary)',
                background: 'white',
                padding: '0.25rem',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 10
              }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              title={ctaLinks['.home-hero-cta'] ? `Lien: ${ctaLinks['.home-hero-cta']}` : 'Cliquer pour choisir un lien'}
            >
              🔗
            </div>
          </div>
          
          <style jsx>{`
            .link-indicator {
              opacity: 0 !important;
            }
            div:hover .link-indicator {
              opacity: 1 !important;
            }
          `}</style>
        </HeroSection>
      </SectionContainer>

      {/* Section 2: Nos savoir-faire (éditable) */}
      <SectionContainer>
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <EditableElement selector=".home-expertise-title" type="title" onSave={save}>
              <Title level={1} align="center" variant="page-title" className="home-expertise-title">Nos savoir-faire</Title>
            </EditableElement>
          </div>
          <EditableElement selector=".home-expertise-description" type="paragraph" onSave={save}>
            <p className="home-expertise-description" style={{ fontSize: '1rem', color: 'var(--color-text)', textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
              Innovation, respect de l'humain et de l'environnement au cœur de notre approche.
            </p>
          </EditableElement>

          <div className="home-expertise-section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[0,1,2].map((index) => (
                <div key={index}>
                  <EditableElement selector={`.home-expertise-card-${index}-title`} type="title" onSave={save}>
                    <h3 className={`home-expertise-card-${index}-title`} style={{ color: 'var(--color-secondary)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
                      {index === 0 ? 'Stratégie IT' : index === 1 ? 'Architecture IT' : 'Analyse de donnée'}
                    </h3>
                  </EditableElement>
                  <ParagraphContainer>
                    <EditableElement selector={`.home-expertise-card-${index}-paragraph`} type="paragraph" onSave={save}>
                      <Paragraph className={`home-expertise-card-${index}-paragraph`}>
                        {homeExpertiseData[index] || ''}
                      </Paragraph>
                    </EditableElement>
                  </ParagraphContainer>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Button 
                      arrow={true} 
                      as={Link} 
                      to={ctaLinks[`.home-expertise-card-${index}-cta`] || '/expertises'}
                    >
                      <span className={`home-expertise-card-${index}-cta`}>Découvrir</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

    </HomeContainer>
  );
};

export default EditableHome; 
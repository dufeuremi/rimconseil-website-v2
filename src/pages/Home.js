import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { RiArrowRightLine } from 'react-icons/ri';
import Header from '../components/Header';
import Button from '../components/Button';
import Title from '../components/Title';
import ExpertiseSection from '../components/ExpertiseSection';
import EnjeuxSection from '../components/EnjeuxSection';
import ValuesSection from '../components/ValuesSection';
import ClientsSection from '../components/ClientsSection';
import PartnersSection from '../components/PartnersSection';
import ActualitesSection from '../components/ActualitesSection';
import Lottie from 'lottie-react';
import maskAnimation from '../assets/animations/mask.json';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../App';
// import Maintenance from './Maintenance';

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

  &.mt-large {
    margin-top: 6rem;
  }

  &.mt-medium {
    margin-top: 3rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 1664px;
  width: 100%;
  margin: 0 auto;
  padding: 0 5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
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

const LottieMaskOverlay = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 80px;
  pointer-events: none;
  overflow: visible;
  z-index: 2;
  /* Masquer le haut du Lottie pour ne garder que la vague */
  mask-image: linear-gradient(to top, black 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, black 60%, transparent 100%);
`;

const HeroSection = styled.div`
  max-width: 1664px;
  width: 100%;
  padding: 96px 5rem 0 5rem;
  text-align: left;
  margin-top: 0;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 96px 2rem 0 2rem;
  }
  // background-color: transparent;
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

const TitleHighlight = styled.span`
  background: linear-gradient(45deg, ${props => props.theme.colors.greenLight}, ${props => props.theme.colors.greenDark});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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


const Home = () => {
  const lottieRef = useRef();
  const directionRef = useRef(1);
  const bgRef = useRef();
  const [ctaLinks, setCtaLinks] = useState({});
  const [homeExpertiseData, setHomeExpertiseData] = useState({
    0: 'Alignement IT et évolution de l\'activité. Référentiels et gouvernance. Transformation organisationnelle. Digitalisation des process.',
    1: "Architecture d'entreprise, applicative et de données. Onprem / Cloud / Hybrid. Move to Cloud. Migration et modernisation.",
    2: 'Audit applicatif. Analyse des flux. Définition de Référentiel MDM. Modélisation Data.',
    3: 'Gestion de projet et accompagnement au changement. Méthodologies agiles et traditionnelles.',
    4: 'Sécurité des systèmes d\'information. Conformité RGPD. Audit de sécurité.'
  });

  // Charger contenu éditable du backend pour la home
  useEffect(() => {
    const loadEditable = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/editable-content/home`);
        if (data?.elements?.length) {
          const links = {};
          const expertiseData = { 
            0: 'Alignement IT et évolution de l\'activité. Référentiels et gouvernance. Transformation organisationnelle. Digitalisation des process.',
            1: "Architecture d'entreprise, applicative et de données. Onprem / Cloud / Hybrid. Move to Cloud. Migration et modernisation.",
            2: 'Audit applicatif. Analyse des flux. Définition de Référentiel MDM. Modélisation Data.',
            3: 'Gestion de projet et accompagnement au changement. Méthodologies agiles et traditionnelles.',
            4: 'Sécurité des systèmes d\'information. Conformité RGPD. Audit de sécurité.'
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
          
          // Load other editable content
          (data.elements || []).forEach(item => {
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
    const t = setTimeout(loadEditable, 400);
    return () => clearTimeout(t);
  }, []);

  // Fonction pour gérer l'aller-retour
  const handleLottieComplete = () => {
    if (lottieRef.current && lottieRef.current.animationItem) {
      directionRef.current = -directionRef.current;
      lottieRef.current.animationItem.setDirection(directionRef.current);
      lottieRef.current.animationItem.setSpeed(0.5);
      lottieRef.current.animationItem.play();
    }
  };

  // Appliquer le mask SVG animé sur le background
  useEffect(() => {
    const updateMask = () => {
      if (!lottieRef.current) return;
      const svg = lottieRef.current.container?.querySelector('svg');
      if (!svg || !bgRef.current) return;
      // Convertir le SVG en data URL
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
    // Mettre à jour le mask à chaque frame
    const interval = setInterval(updateMask, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <HomeContainer>
      {/* Masquer la popup de maintenance */}
      {/* <Maintenance /> */}
      <SectionContainer className="hero-section">
        <BackgroundContainer>
          <BackgroundImage />
          {/* Lottie visible en blanc, en overlay bas */}
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
          <Subtitle className="home-hero-subtitle">Conseil et accompagnement d'entreprise</Subtitle>
          <Title level={1} align="center" variant="page-title" style={{ color: '#fff', fontWeight: 600 }} className="home-hero-title">
            Piloter l'IT avec <TitleHighlight>sens.</TitleHighlight>
          </Title>
          <Description className="home-hero-description">
            Votre partenaire pour co-construire vos solutions IT responsables qui allient innovation et respect des valeurs écologiques et sociales
          </Description>
          <Button 
            arrow={true} 
            as={Link} 
            to={ctaLinks['.home-hero-cta'] || '/services'}
          >
            <span className="home-hero-cta">Voir les services</span>
          </Button>
        </HeroSection>
      </SectionContainer>

      <SectionContainer className="mt-large">
        <ContentContainer>
          <EnjeuxSection ctaLinks={ctaLinks} />
        </ContentContainer>
      </SectionContainer>

      <SectionContainer>
        <ValuesSection />
      </SectionContainer>

      <SectionContainer>
        <PartnersSection />
      </SectionContainer>

      <SectionContainer>
        <ClientsSection useWhiteLogo={true} />
      </SectionContainer>

      <SectionContainer>
        <ActualitesSection />
      </SectionContainer>
    </HomeContainer>
  );
};

export default Home; 
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EnjeuxCard from './EnjeuxCard';
import Title from './Title';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import axios from 'axios';
import { API_BASE_URL } from '../App';

const SectionContainer = styled.section`
  background-color: #4a5464;
  filter: brightness(0.92) contrast(0.88);
  width: 100vw;
  min-height: 100vh;
  margin-left: calc(-50vw + 50%);
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 8rem;
  padding-top: 3rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${require('../assets/images/texturewaves.jpg')});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.3;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding-top: 0.5rem;

  h2, h1, h3, h4, h5, h6, .title, .page-title {
    color: #fff !important;
  }
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: #fff;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const CarouselContainer = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
`;

const CardsWrapper = styled.div`
  overflow: hidden;
  padding: 0 60px;
  
  @media (max-width: 768px) {
    padding: 0 50px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 2rem;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => props.$offset}px);
`;

const CardWrapper = styled.div`
  min-width: calc((100% - 4rem) / 2.5);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  color: var(--color-primary);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s ease;
  opacity: 1;
  
  &:hover {
    background-color: var(--color-primary);
    color: var(--color-white);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &.prev {
    left: 0;
  }
  
  &.next {
    right: 0;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const EnjeuxSection = ({ ctaLinks = {} }) => {
  const [localCtaLinks, setLocalCtaLinks] = useState(ctaLinks);
  
  // Mettre à jour les liens locaux quand les props changent
  useEffect(() => {
    setLocalCtaLinks(ctaLinks);
  }, [ctaLinks]);
  
  // Données des cartes d'enjeux
  const enjeuxData = [
    {
      title: "Nom de l'enjeux",
      description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.",
      link: "/contact",
      details: [
        "Accompagnement personnalisé à chaque étape",
        "Intégration des valeurs humaines dans la transformation",
        "Solutions respectueuses de l'environnement",
        "Suivi et optimisation continue"
      ]
    },
    {
      title: "Nom de l'enjeux",
      description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.",
      link: "/contact",
      details: [
        "Stratégies d'innovation adaptées à votre secteur",
        "Mise en place de processus respectueux",
        "Optimisation des ressources existantes",
        "Formation et transfert de compétences"
      ]
    },
    {
      title: "Nom de l'enjeux",
      description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.",
      link: "/contact",
      details: [
        "Audit complet de l'existant",
        "Proposition de solutions sur mesure",
        "Implémentation progressive",
        "Mesure de performance et ajustements"
      ]
    },
    {
      title: "Transformation digitale",
      description: "Accompagner votre entreprise dans sa transformation numérique avec des solutions adaptées à vos besoins.",
      link: "/contact",
      details: [
        "Évaluation de la maturité digitale",
        "Conception d'une feuille de route de transformation",
        "Modernisation des systèmes existants",
        "Accompagnement au changement et formation des équipes"
      ]
    },
    {
      title: "Sécurité des données",
      description: "Protéger vos informations sensibles avec des stratégies de sécurité robustes et conformes aux réglementations.",
      link: "/contact",
      details: [
        "Audit de sécurité et identification des vulnérabilités",
        "Mise en place de solutions de protection adaptées",
        "Conformité RGPD et autres réglementations",
        "Formation des équipes aux bonnes pratiques de sécurité"
      ]
    },
    {
      title: "Performance IT",
      description: "Optimiser vos infrastructures pour une meilleure performance et une réduction des coûts opérationnels.",
      link: "/contact",
      details: [
        "Analyse des performances actuelles",
        "Optimisation des infrastructures et applications",
        "Automatisation des processus IT",
        "Réduction des coûts et amélioration de l'efficacité opérationnelle"
      ]
    }
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  
  useEffect(() => {
    const updateCardWidth = () => {
      const container = document.querySelector('.cards-wrapper');
      if (container) {
        const width = container.offsetWidth;
        // Largeur d'une carte = (largeur totale - gaps) / 2.5
        const calculatedWidth = (width - 60) / 2.5 + 32; // +32 pour le gap
        setCardWidth(calculatedWidth);
      }
    };
    
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(enjeuxData.length - 1, prev + 1));
  };
  
  const offset = -currentPage * cardWidth;

  // Inject editable content from API for home section
  useEffect(() => {
    const loadEditable = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/editable-content/enjeux`);
        const links = {};
        
        (data.elements || []).forEach(item => {
          const el = document.querySelector(item.element_selector);
          if (el) {
            if (item.element_type === 'deleted') {
              el.style.display = 'none';
              return;
            }
            
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
        
        setLocalCtaLinks(prev => ({ ...prev, ...links }));
      } catch {}
    };
    const t = setTimeout(loadEditable, 200);
    return () => clearTimeout(t);
  }, [currentPage]);

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={2} align="center" variant="section-title" style={{ color: '#fff' }} className="enjeux-title">
          Vos enjeux
        </Title>
      </TitleContainer>
      <SectionDescription className="enjeux-description">
        Nous analysons vos défis spécifiques pour vous proposer des solutions sur mesure et innovantes.
      </SectionDescription>
      
      <CarouselContainer>
        <NavigationButton 
          className="prev" 
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
          aria-label="Carte précédente"
        >
          <RiArrowLeftSLine size={28} />
        </NavigationButton>
        
        <CardsWrapper className="cards-wrapper">
          <CardsContainer $offset={offset}>
            {enjeuxData.map((enjeu, index) => (
              <CardWrapper key={index}>
                <EnjeuxCard 
                  title={enjeu.title}
                  description={enjeu.description}
                  link={enjeu.link}
                  details={enjeu.details}
                  index={index}
                  classNamePrefix={`enjeu-${index}`}
                  ctaLinks={localCtaLinks}
                />
              </CardWrapper>
            ))}
          </CardsContainer>
        </CardsWrapper>
        
        <NavigationButton 
          className="next" 
          onClick={handleNextPage} 
          disabled={currentPage >= enjeuxData.length - 1}
          aria-label="Carte suivante"
        >
          <RiArrowRightSLine size={28} />
        </NavigationButton>
      </CarouselContainer>
    </SectionContainer>
  );
};

export default EnjeuxSection; 
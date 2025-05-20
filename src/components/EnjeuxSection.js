import React, { useState } from 'react';
import styled from 'styled-components';
import EnjeuxCard from './EnjeuxCard';
import Title from './Title';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const SectionContainer = styled.section`
  background-color: #303947;
  background-image: url(${require('../assets/images/texturewaves.jpg')});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-blend-mode: multiply;
  filter: brightness(0.8);
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 8rem;
  padding-top: 5rem;
  position: relative;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 3.5rem;
  padding-top: 2.5rem;

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
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  overflow: hidden;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-white);
  color: var(--color-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--color-quaternary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.3s ease;
  opacity: 0.2;
  
  &:hover {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.prev {
    left: -20px;
  }
  
  &.next {
    right: -20px;
  }
  
  @media (max-width: 768px) {
    &.prev {
      left: 0;
    }
    
    &.next {
      right: 0;
    }
  }
`;

const EnjeuxSection = () => {
  // Données des cartes d'enjeux
  const enjeuxData = [
    {
      title: "Nom de l'enjeux",
      description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.",
      link: "/contact",
      image: "/images/enjeux/enjeu1.jpg", // Image qui pourrait ne pas exister
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
      image: "/images/enjeux/enjeu2.jpg", // Image qui pourrait ne pas exister
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
      image: "/images/enjeux/enjeu3.jpg", // Image qui pourrait ne pas exister
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
      image: "/images/enjeux/enjeu4.jpg", // Image qui pourrait ne pas exister
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
      image: "/images/enjeux/enjeu5.jpg", // Image qui pourrait ne pas exister
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
      image: "/images/enjeux/enjeu6.jpg", // Image qui pourrait ne pas exister
      details: [
        "Analyse des performances actuelles",
        "Optimisation des infrastructures et applications",
        "Automatisation des processus IT",
        "Réduction des coûts et amélioration de l'efficacité opérationnelle"
      ]
    }
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 3; // Nombre de cartes visibles à la fois
  const maxPages = Math.ceil(enjeuxData.length / cardsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(maxPages - 1, prev + 1));
  };
  
  // Calculer les cartes à afficher sur la page actuelle
  const startIndex = currentPage * cardsPerPage;
  const visibleCards = enjeuxData.slice(startIndex, startIndex + cardsPerPage);

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={2} align="center" variant="section-title" style={{ color: '#fff' }}>
          Vos enjeux
        </Title>
      </TitleContainer>
      <SectionDescription>
        Nous analysons vos défis spécifiques pour vous proposer des solutions sur mesure et innovantes.
      </SectionDescription>
      
      <CarouselContainer>
        <NavigationButton 
          className="prev" 
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
          aria-label="Carte précédente"
        >
          <RiArrowLeftSLine size={24} />
        </NavigationButton>
        
        <CardsContainer>
          {visibleCards.map((enjeu, index) => (
            <EnjeuxCard 
              key={startIndex + index}
              title={enjeu.title}
              description={enjeu.description}
              link={enjeu.link}
              image={enjeu.image}
              details={enjeu.details}
              index={startIndex + index}
            />
          ))}
        </CardsContainer>
        
        <NavigationButton 
          className="next" 
          onClick={handleNextPage} 
          disabled={currentPage >= maxPages - 1}
          aria-label="Carte suivante"
        >
          <RiArrowRightSLine size={24} />
        </NavigationButton>
      </CarouselContainer>
    </SectionContainer>
  );
};

export default EnjeuxSection; 
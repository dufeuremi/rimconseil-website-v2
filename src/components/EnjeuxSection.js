import React, { useState } from 'react';
import styled from 'styled-components';
import EnjeuxCard from './EnjeuxCard';
import Title from './Title';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const SectionContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: var(--color-text);
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
      image: "/images/enjeux/enjeu1.jpg" // Image qui pourrait ne pas exister
    },
    {
      title: "Nom de l'enjeux",
      description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.",
      link: "/contact",
      image: "/images/enjeux/enjeu2.jpg" // Image qui pourrait ne pas exister
    },
    {
      title: "Nom de l'enjeux",
      description: "Innovation, respect de l'humain et de l'environnement au cœur de notre approche.",
      link: "/contact",
      image: "/images/enjeux/enjeu3.jpg" // Image qui pourrait ne pas exister
    },
    {
      title: "Transformation digitale",
      description: "Accompagner votre entreprise dans sa transformation numérique avec des solutions adaptées à vos besoins.",
      link: "/contact",
      image: "/images/enjeux/enjeu4.jpg" // Image qui pourrait ne pas exister
    },
    {
      title: "Sécurité des données",
      description: "Protéger vos informations sensibles avec des stratégies de sécurité robustes et conformes aux réglementations.",
      link: "/contact",
      image: "/images/enjeux/enjeu5.jpg" // Image qui pourrait ne pas exister
    },
    {
      title: "Performance IT",
      description: "Optimiser vos infrastructures pour une meilleure performance et une réduction des coûts opérationnels.",
      link: "/contact",
      image: "/images/enjeux/enjeu6.jpg" // Image qui pourrait ne pas exister
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
        <Title level={2} align="center">Vos enjeux</Title>
      </TitleContainer>
      <SectionDescription>
        Comprendre vos enjeux pour trouver les meilleures solutions.
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
import React from 'react';
import styled from 'styled-components';
import ExpertiseCard from './ExpertiseCard';
import Title from './Title';

// Import des animations Lottie pour les expertises
import clearAAnimation from '../assets/animations/clearA.json';
import clearBAnimation from '../assets/animations/clearB.json';
import clearCAnimation from '../assets/animations/clearC.json';

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

const Description = styled.p`
  font-size: 1rem;
  color: var(--color-text);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Données pour les cartes d'expertise
const expertiseData = [
  {
    title: "Stratégie IT",
    lottieFile: clearAAnimation,
    iconAlt: "Animation représentant la stratégie IT",
    type: "strategie",
    items: [
      "Alignement IT et évolution de l'activité",
      "Référentiels et gouvernance",
      "Transformation organisationnelle",
      "Digitalisation des process",
      "Analyse des pain points"
    ]
  },
  {
    title: "Architecture IT",
    lottieFile: clearBAnimation,
    iconAlt: "Animation représentant l'architecture IT",
    type: "architecture",
    items: [
      "Architecture d'entreprise, applicative et de données",
      "Onprem / Cloud / Hybrid",
      "Move to Cloud"
    ]
  },
  {
    title: "Analyse de donnée",
    lottieFile: clearCAnimation,
    iconAlt: "Animation représentant l'analyse de données",
    type: "analyse",
    items: [
      "Audit applicatif",
      "Analyse des flux",
      "Définition de Référentiel MDM",
      "Modélisation Data"
    ]
  }
];

const ExpertiseSection = () => {
  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={2} align="center">Nos savoir-faire</Title>
      </TitleContainer>
      <Description>
        Innovation, respect de l'humain et de l'environnement au cœur de notre approche.
      </Description>
      
      <CardsContainer>
        {expertiseData.map((expertise, index) => (
          <ExpertiseCard 
            key={index}
            title={expertise.title}
            lottieFile={expertise.lottieFile}
            iconAlt={expertise.iconAlt}
            items={expertise.items}
            type={expertise.type}
          />
        ))}
      </CardsContainer>
    </SectionContainer>
  );
};

export default ExpertiseSection; 
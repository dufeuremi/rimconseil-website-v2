import React from 'react';
import styled from 'styled-components';
import ValueCard from '../components/ValueCard';
import Title from '../components/Title';

// Import des animations Lottie
import animation1 from '../assets/animations/animation2.json';
import animation2 from '../assets/animations/animation5.json';
import animation3 from '../assets/animations/animation6.json';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem 2rem;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Valeurs = () => {
  // Données des cartes de valeurs
  const valuesData = [
    {
      title: "Valeurs Sociales",
      lottieFile: animation1,
      iconAlt: "Animation représentant des connexions sociales",
      items: [
        "Placer l'humain au cœur du processus de transformation: (écoute, implication, co-construction, acteurs du changement)",
        "Protéger des données individuelles"
      ]
    },
    {
      title: "Valeurs écologiques",
      lottieFile: animation2,
      iconAlt: "Animation représentant les valeurs écologiques",
      items: [
        "Infrastructures et équipements responsables (longévité, réparabilité, évolutivité)",
        "Gestion sobre des données (collecte optimisée, conservation raisonnée)",
        "Optimisation des flux pour réduire l'empreinte énergétique",
        "Conformité réglementaire sur la durée de vie des données"
      ]
    },
    {
      title: "Innovation et pratiques agiles",
      lottieFile: animation3,
      iconAlt: "Animation représentant l'innovation",
      items: [
        "Des architectures IT évolutives",
        "Approches Data centric",
        "Approches agiles et collaboratives"
      ]
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title level={1} align="center">Nos valeurs</Title>
      </Header>
      <PageDescription>
        L'objectif, c'est de fournir du conseil pour des solutions IT responsables qui allient:
      </PageDescription>
      
      <CardsContainer>
        {valuesData.map((card, index) => (
          <ValueCard 
            key={index}
            title={card.title}
            lottieFile={card.lottieFile}
            iconAlt={card.iconAlt}
            items={card.items}
          />
        ))}
      </CardsContainer>
    </PageContainer>
  );
};

export default Valeurs; 
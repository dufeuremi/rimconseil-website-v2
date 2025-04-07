import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
import Title from './Title';

const SectionContainer = styled.section`
  max-width: 1200px;
  margin: 5rem auto;
  padding: 0 2rem;
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

const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SolutionCard = styled.div`
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SolutionNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const SolutionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 1rem;
`;

const SolutionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SolutionItem = styled.li`
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-primary);
  }
`;

const MoreButtonContainer = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const MoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

const SolutionsSection = () => {
  // Données des solutions
  const solutionsData = [
    {
      number: "01",
      title: "Diagnostic de votre système d'information",
      items: [
        "Analyse de l'existant technique et organisationnel",
        "Identification des points forts et axes d'amélioration",
        "Recommandations stratégiques"
      ]
    },
    {
      number: "02",
      title: "Architecture et conception",
      items: [
        "Définition d'architectures évolutives et durables",
        "Approche centrée sur les données",
        "Intégration de solutions cloud optimisées"
      ]
    },
    {
      number: "03",
      title: "Plan de transformation SI",
      items: [
        "Feuille de route stratégique",
        "Définition des solutions adaptées",
        "Planification et évaluation financière"
      ]
    },
    {
      number: "04",
      title: "Pilotage et accompagnement",
      items: [
        "Direction de projets et programmes IT",
        "Suivi de la réalisation et recette",
        "Formation et transfert de compétences"
      ]
    }
  ];

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={2} align="center">Nos solutions</Title>
      </TitleContainer>
      <SectionDescription>
        Des solutions IT responsables qui allient innovation, respect de l'humain et de l'environnement.
      </SectionDescription>
      
      <SolutionsGrid>
        {solutionsData.map((solution, index) => (
          <SolutionCard key={index}>
            <SolutionNumber>{solution.number}</SolutionNumber>
            <SolutionTitle>{solution.title}</SolutionTitle>
            <SolutionList>
              {solution.items.map((item, itemIndex) => (
                <SolutionItem key={itemIndex}>{item}</SolutionItem>
              ))}
            </SolutionList>
          </SolutionCard>
        ))}
      </SolutionsGrid>
      
      <MoreButtonContainer>
        <MoreButton to="/services">
          Tous nos services <RiArrowRightLine />
        </MoreButton>
      </MoreButtonContainer>
    </SectionContainer>
  );
};

export default SolutionsSection; 
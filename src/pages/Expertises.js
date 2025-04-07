import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Title from '../components/Title';
import Text from '../components/Text';
import Lottie from 'lottie-react';
import approcheSvg from '../assets/images/approche.svg'; // Import de l'image SVG

// Import des animations Lottie
import clearAAnimation from '../assets/animations/clearA.json';
import clearBAnimation from '../assets/animations/clearB.json';
import clearCAnimation from '../assets/animations/clearC.json';

// Import de l'image des partenaires
import partenairesImage from '../assets/images/clients.png';

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  overflow: visible; /* S'assurer que le contenu n'est pas masqué */
`;

const Section = styled.section`
  margin-bottom: 5rem;
  overflow: visible; /* S'assurer que le contenu n'est pas masqué */
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

const ApproachDiagram = styled.img`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 0 0;
  display: block;
`;

const ExpertiseGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem; /* Augmentation de l'écart entre les blocs */
  position: relative;
  padding: 2rem 0; /* Ajouter un padding pour tenir compte des animations qui débordent */
`;

const ExpertiseBlock = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2.5rem;
  align-items: flex-start;
  position: relative;
  padding: 2rem;
  overflow: visible; /* Changer overflow:hidden à overflow:visible pour permettre le chevauchement */
  
  &:nth-child(odd) {
    background-color: var(--color-light-gray, #f5f5f5);
    border-radius: 8px;
    margin-right: 15%;
  }
  
  &:nth-child(even) {
    background-color: var(--color-light-gray, #f5f5f5);
    border-radius: 8px;
    margin-left: 15%;
  }

  /* Inverser l'ordre pour les blocs pairs (Architecture IT) */
  &:nth-child(even) {
    grid-template-columns: auto 1fr;
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
  font-weight: 800; /* Changé de 300 à 800 pour extrabold */
  color: var(--color-primary); /* Changé de var(--color-olive) à var(--color-primary) pour bleu */
  line-height: 1;
  margin-top: -1rem; /* Ajustement pour aligner avec le titre */

  @media (max-width: 992px) {
    font-size: 4rem;
    margin-bottom: -1rem; /* Réduire l'espace en dessous sur mobile */
    grid-row: 1; /* Assurer que le numéro est en premier */
  }
`;

const ExpertiseContent = styled.div`
  grid-column: 2;
  padding-right: 1rem; /* Ajouter un peu d'espace à droite */
  
  @media (max-width: 992px) {
    grid-column: 1; /* Prendre toute la largeur sur mobile */
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

const ExpertiseIllustrationPlaceholder = styled.div`
  width: 200px;
  height: 150px;
  background-color: var(--color-quaternary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-tertiary);
  grid-column: 3; /* Placer l'illustration dans la 3ème colonne */
  align-self: center; /* Centrer l'illustration verticalement */

  &::after {
    content: '[Illust.]';
    font-size: 0.8rem;
  }

  /* Placer l'illustration à gauche pour les blocs pairs si nécessaire */
  /*
  ${ExpertiseBlock}:nth-child(even) & {
    grid-column: 1; 
    grid-row: 1; 
  }
  */

  @media (max-width: 992px) {
    grid-column: 1; /* Prendre toute la largeur sur mobile */
    grid-row: 3;
    width: 150px;
    height: 100px;
    margin-top: 1rem;
    justify-self: center; /* Centrer horizontalement */
  }
`;

const SubPoint = styled.div`
  margin-bottom: 0; /* Supprimé car maintenant géré par SubPointText */
`;

const SubPointTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 0.25rem; /* Réduit pour rapprocher le titre du texte */
  display: flex;
  align-items: flex-start;

  &::before {
    content: attr(data-number);
    color: var(--color-primary);
    margin-right: 0.75rem; /* Légèrement augmenté */
    font-size: 1.1rem; /* Légèrement plus grand */
    min-width: 1.5rem; /* Largeur fixe pour aligner correctement */
    text-align: left;
  }
`;

const SubPointText = styled(Text)`
  font-size: 0.95rem;
  line-height: 1.5; /* Légèrement réduit */
  color: var(--color-text);
  margin-left: 0; /* Supprimé la marge à gauche pour aligner sur la gauche */
  margin-bottom: 1.75rem; /* Espacement entre les points */
  max-width: 90%; /* Limiter la largeur pour améliorer la lisibilité */
`;

// Data for Expertise Blocks
const expertiseData = [
  {
    number: '1',
    title: 'Stratégie IT',
    illustrationPlaceholder: true,
    subPoints: [
      {
        title: 'Alignement de vos stratégies IT',
        text: "Alignement de vos stratégies IT (DATA, ERP, ...) avec les perspectives d'évolutions de l'activité de votre structure et de son écosystème. Nous analysons votre contexte métier pour garantir que vos systèmes d'information soutiennent efficacement vos objectifs stratégiques et votre croissance."
      },
      {
        title: 'Définition des référentiels structurants et leurs modes de gouvernance',
        text: 'Nous élaborons des cadres de référence solides qui standardisent vos processus IT et établissons des règles claires pour la prise de décision et la gestion des systèmes.'
      },
      {
        title: 'Transformation organisationnelle',
        text: "Nous vous accompagnons dans la refonte de vos structures organisationnelles pour les adapter aux nouveaux enjeux digitaux, en tenant compte de l'aspect humain et des résistances au changement."
      }
    ]
  },
  {
    number: '2',
    title: 'Architecture IT',
    illustrationPlaceholder: true,
    subPoints: [
      {
        title: "Architecture d'entreprise, applicative et de données",
        text: 'Nous concevons des architectures robustes qui alignent systèmes informatiques, processus métiers et stratégie globale, garantissant cohérence et performance de votre écosystème IT.'
      },
      {
        title: 'Onprem / Cloud / Hybrid',
        text: "Nous vous guidons dans le choix et l'implémentation de solutions adaptées à vos besoins, qu'elles soient sur site, dans le cloud ou hybrides, en tenant compte des contraintes de sécurité, performance et coût."
      },
      {
        title: 'Move to Cloud',
        text: "Nous orchestrons votre migration vers le cloud en minimisant les risques et perturbations, tout en maximisant les bénéfices liés à la flexibilité, l'évolutivité et l'optimisation des coûts."
      }
    ]
  },
  {
    number: '3',
    title: 'Analyse de donnée',
    illustrationPlaceholder: true,
    subPoints: [
      {
        title: 'Audit applicatif',
        text: "Nous évaluons en profondeur vos applications existantes pour identifier les forces, faiblesses et opportunités d'amélioration, vous aidant à prendre des décisions éclairées sur l'évolution de votre patrimoine applicatif."
      },
      {
        title: 'Analyse des flux',
        text: "Nous cartographions et optimisons les flux de données entre vos systèmes pour éliminer les redondances, réduire les latences et améliorer la fiabilité de vos échanges d'information."
      },
      {
        title: 'Définition de Référentiel MDM',
        text: 'Nous établissons une gestion centralisée de vos données de référence (Master Data Management) pour garantir leur unicité, cohérence et fiabilité à travers tous vos systèmes.'
      },
      {
        title: 'Modélisation Data',
        text: "Nous concevons des modèles de données adaptés à vos besoins métiers, facilitant l'exploitation et l'analyse de vos données, tout en préparant le terrain pour l'intelligence artificielle et le machine learning."
      },
      {
        title: 'Analyse des Pain Points',
        text: "Nous identifions et adressons les points de friction dans vos processus et systèmes pour améliorer l'expérience utilisateur et l'efficacité opérationnelle."
      }
    ]
  }
];

// Nouveau composant pour l'animation Lottie
const AnimationContainer = styled.div`
  position: absolute;
  top: -40px;
  right: -40px;
  width: 180px;
  height: 180px;
  opacity: 1;
  z-index: 10;
  transform: rotate(8deg); /* Légère rotation pour un effet dynamique */
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1)); /* Ajouter une ombre pour l'effet de profondeur */
  overflow: visible; /* S'assurer que le contenu n'est pas masqué */
`;

// Fonction pour obtenir le caractère de numéro encerclé
const getCircledNumber = (num) => {
  const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];
  return circledNumbers[num] || `${num + 1}`;
};

// Composant d'expertise avec animation
const ExpertiseBlockWithAnimation = ({ expertise, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef(null);
  
  const getAnimationData = () => {
    if (index === 0) return clearAAnimation;
    if (index === 1) return clearBAnimation;
    return clearCAnimation;
  };
  
  // Gérer l'animation Lottie lors du survol
  useEffect(() => {
    if (!lottieRef.current || !lottieRef.current.animationItem) return;
    
    const anim = lottieRef.current.animationItem;
    
    if (isHovered) {
      // Animation vers l'avant lors du survol
      anim.setDirection(1);
      anim.setSpeed(2.5);
      anim.play();
    } else {
      // Animation inverse lorsque le survol est terminé
      anim.setDirection(-1); // Inverser la direction
      anim.setSpeed(3); // Légèrement plus rapide pour le retour
      anim.play();
    }
  }, [isHovered]);
  
  return (
    <ExpertiseBlock 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ExpertiseNumber>{expertise.number}</ExpertiseNumber>
      <ExpertiseContent>
        <ExpertiseTitle>{expertise.title}</ExpertiseTitle>
        {expertise.subPoints.map((sub, subIndex) => (
          <SubPoint key={subIndex}>
            <SubPointTitle data-number={getCircledNumber(subIndex)}>{sub.title}</SubPointTitle>
            <SubPointText>{sub.text}</SubPointText>
          </SubPoint>
        ))}
      </ExpertiseContent>
      <AnimationContainer isHovered={isHovered}>
        <Lottie
          lottieRef={lottieRef}
          animationData={getAnimationData()}
          loop={false}
          autoplay={false}
          style={{ 
            width: '100%',
            height: '100%',
            transformOrigin: 'top right',
            backgroundColor: 'transparent',
            pointerEvents: 'none' // Pour éviter que l'animation bloque les interactions
          }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet' // Changer 'slice' à 'meet' pour éviter le masquage
          }}
        />
      </AnimationContainer>
    </ExpertiseBlock>
  );
};

// Nouveaux composants pour la section des partenaires
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

const PartnersImage = styled.img`
  max-width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
`;

const Expertises = () => {
  return (
    <PageContainer>
      <Section>
        <SectionTitle level={1}>Notre approche</SectionTitle>
        <ApproachText>
          Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers.
        </ApproachText>
        <ApproachDiagram src={approcheSvg} alt="Schéma de notre approche" />
      </Section>

      <Section>
        <SectionTitle level={1}>Nos domaines d'expertise</SectionTitle>
        <ExpertiseGrid>
          {expertiseData.map((exp, index) => (
            <ExpertiseBlockWithAnimation key={index} expertise={exp} index={index} />
          ))}
        </ExpertiseGrid>
      </Section>

      <PartnersSection>
        <PartnersTitle>Ils approuvent notre expertise</PartnersTitle>
        <PartnersImage src={partenairesImage} alt="Nos partenaires" />
      </PartnersSection>
    </PageContainer>
  );
};

export default Expertises; 
import React from 'react';
import styled from 'styled-components';
import Title from '../components/Title';
import Text from '../components/Text';
import ZoneIntervention from '../components/ZoneIntervention';
import clientsImage from '../assets/images/clients.png';

// Réutilisation des styled components de la page Expertises, si possible
// S'ils sont exportés d'un fichier commun, les importer. Sinon, les dupliquer ou les adapter ici.
// Pour cet exemple, je vais dupliquer/adapter les styles nécessaires.

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Section = styled.section`
  margin-bottom: 5rem;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 1.5rem;
`;

const IntroText = styled(Text)`
  max-width: 900px;
  margin-bottom: 4rem; // Ou plus si l'image du schéma est présente
  line-height: 1.7;
`;

// Placeholder pour le schéma s'il y en a un pour cette page
const ServiceDiagramPlaceholder = styled.div`
  width: 100%;
  max-width: 800px; // Ajuster la taille si nécessaire
  height: 400px;    // Ajuster la taille si nécessaire
  background-color: var(--color-quaternary);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-tertiary);
  border-radius: 4px;
  &::after {
    content: '[Placeholder - Schéma Processus]';
  }
`;

const ServiceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem; 
`;

const ServiceBlock = styled.div`
  display: grid;
  grid-template-columns: auto 1fr; // Colonnes pour numéro et texte
  gap: 2rem; // Réduit l'écart entre numéro et texte
  align-items: flex-start;
  position: relative;
  padding: 2rem;
  
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr; // Empiler sur mobile
    gap: 1.5rem;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ServiceNumber = styled.span`
  font-size: 4rem; // Taille de numéro légèrement réduite
  font-weight: 300;
  color: var(--color-olive); // Conserver la couleur ou choisir une autre du thème
  line-height: 1;
  margin-top: -0.5rem; // Ajustement pour alignement

  @media (max-width: 768px) {
    font-size: 3rem;
    grid-row: 1;
  }
`;

const ServiceContent = styled.div`
  grid-column: 2;
  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem; // Taille de titre ajustée
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
`;

const SubPoint = styled.div`
  margin-bottom: 1.5rem;
`;

const SubPointTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;

  &::before {
    content: '◎';
    color: var(--color-primary);
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

const SubPointText = styled(Text)`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-light);
`;

// Data for Service Blocks
const serviceData = [
  {
    number: '1',
    title: 'Cadrage du projet et du besoin',
    subPoints: [
      { title: 'Cadrage des objectifs et du périmètre du projet', text: '' },
      { title: 'Identification résultats attendus du changement', text: '' },
      { title: 'Choix des parties prenantes du projet', text: '' },
      { title: 'Budget prévisionnel du projet', text: '' },
      { title: 'Planification du projet', text: '' }
    ]
  },
  {
    number: '2',
    title: 'Vision globale et état des lieux du SI',
    subPoints: [
      { title: "Etat des lieux de l'architecture SI et audit du SI et les applicatifs DATA existants", text: '' },
      { title: 'Stratégie et culture actuelle du SI', text: '' },
      { title: 'Diagnostic et audit organisationnel de la DSI', text: '' },
      { title: 'Diagnostic organisationnel, des processus et des méthodes', text: '' },
      { title: 'Evaluation de la dette SI', text: '' }
    ]
  },
  {
    number: '3',
    title: 'Evolution du SI Projet cible',
    subPoints: [
      { title: "Définition du projet cible DATA/ BI (Stratégie, Métier, Applicatif et Infrastructures IT)", text: '' },
      { title: "Accompagnement à l'expression des besoins utilisateurs", text: '' },
      { title: "Accompagnement à l'évolution des usages, processus et des pratiques", text: '' },
      { title: "Choix et mise en place d'outils « référentiels d'architecture » et les standards de modélisation", text: '' },
      { title: 'Accompagnement au changement', text: '' }
    ]
  },
  {
    number: '4',
    title: 'Plan de transformation SI',
    subPoints: [
      { title: 'Feuille de route du plan de transformation et trajectoire de déploiement SI/BI/DATA', text: '' },
      { title: 'Cahier des charges, spécifications fonctionnelles et détaillées', text: '' },
      { title: "Définition de la typologie de solutions, scenarios d'intégration de la solution (Onprem, Cloud, Hybride), système d'exploitation, modalités de développement et de maintenance...", text: '' },
      { title: 'Planification et évaluation financière du plan de déploiement', text: '' }
    ]
  },
  {
    number: '5',
    title: 'Pilotage du plan de transformation SI',
    subPoints: [
      { title: 'Direction de projets', text: '' },
      { title: 'Direction de programmes IT', text: '' },
      { title: 'Consultation et évaluation des solutions du marché', text: '' },
      { title: "Accompagnement au choix de solutions : coût, cycle de vie/évolutivité, exploitation, ROI, qualité, pérennité...", text: '' },
      { title: 'Suivi de la réalisation du cahier des charges', text: '' },
      { title: 'Recette du projet', text: '' },
      { title: 'Pilotage du Delivery, suivi de la mise en prod', text: '' },
      { title: 'Maîtrise du Run', text: '' }
    ]
  }
];

// Ajouter les composants styled pour la section des clients
const ClientsSection = styled.section`
  margin-top: 5rem;
  margin-bottom: 5rem;
  text-align: center;
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

const Services = () => {
  return (
    <PageContainer>
      <Section>
        <SectionTitle level={1} align="left">Comment allons-nous procéder ?</SectionTitle>
        <IntroText>
          Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers.
        </IntroText>
        {/* Optionnel: Ajouter ici le placeholder du schéma si nécessaire */}
        {/* <ServiceDiagramPlaceholder /> */}
      </Section>

      <ServiceGrid>
        {serviceData.map((service, index) => (
          <ServiceBlock key={index}>
            <ServiceNumber>{service.number}</ServiceNumber>
            <ServiceContent>
              <ServiceTitle>{service.title}</ServiceTitle>
              {service.subPoints.map((sub, subIndex) => (
                <SubPoint key={subIndex}>
                  {/* Pour l'instant, seul le titre est affiché car le texte est vide */}
                  <SubPointTitle>{sub.title}</SubPointTitle>
                  {/* {sub.text && <SubPointText>{sub.text}</SubPointText>} */}
                </SubPoint>
              ))}
            </ServiceContent>
          </ServiceBlock>
        ))}
      </ServiceGrid>
      
      <ZoneIntervention />
      
      <ClientsSection>
        <ClientsTitle>Ils approuvent notre expertise</ClientsTitle>
        <ClientsImage src={clientsImage} alt="Nos clients" />
      </ClientsSection>
    </PageContainer>
  );
};

export default Services; 
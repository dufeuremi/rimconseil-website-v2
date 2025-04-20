import React from 'react';
import styled from 'styled-components';
import Title from '../components/Title';
import Text from '../components/Text';
import ZoneIntervention from '../components/ZoneIntervention';
import clientsImage from '../assets/images/clients.png';

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  overflow: visible;
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0;
  overflow: visible;
  padding: 2rem 0;

  &.content-section {
    min-height: auto;
    margin-bottom: 5rem;
  }
`;

const IntroContainer = styled.div`
  max-width: 800px;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const IntroText = styled(Text)`
  width: 100%;
  margin-bottom: 4rem;
  line-height: 1.7;
  text-align: left;
`;

const ServiceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
  position: relative;
  padding: 2rem 0;
`;

const ServiceBlock = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: flex-start;
  position: relative;
  padding: 3rem;
  background-color: var(--color-light-gray, #f5f5f5);
  border-radius: 0;
  
  &:nth-child(odd) {
    margin-right: 10%;
  }
  
  &:nth-child(even) {
    margin-left: 10%;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-left: 0;
    margin-right: 0;
    padding: 2rem;
  }
`;

const ServiceNumber = styled.span`
  font-size: 5rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1;
  margin-top: -1rem;
  opacity: 0.9;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 3.5rem;
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
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 2rem;
`;

const SubPoint = styled.div`
  margin-bottom: 1.5rem;
`;

const SubPointTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const NumberBullet = styled.span`
  background-color: var(--color-primary);
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.75rem;
`;

const SubPointText = styled(Text)`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-light);
`;

// Nouveaux composants pour la section des clients
const ClientsSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 2rem 0;
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

const ZoneInterventionWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
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

const Services = () => {
  return (
    <PageContainer>
      <Section>
        <IntroContainer>
          <SectionTitle level={1}>Comment allons-nous procéder ?</SectionTitle>
          <IntroText>
            Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers.
          </IntroText>
        </IntroContainer>
      </Section>

      <Section className="content-section">
        <ServiceGrid>
          {serviceData.map((service, index) => (
            <ServiceBlock key={index}>
              <ServiceNumber>{service.number}</ServiceNumber>
              <ServiceContent>
                <ServiceTitle>{service.title}</ServiceTitle>
                {service.subPoints.map((sub, subIndex) => (
                  <SubPoint key={subIndex}>
                    <SubPointTitle>
                      <NumberBullet>{subIndex + 1}</NumberBullet>
                      {sub.title}
                    </SubPointTitle>
                    {sub.text && <SubPointText>{sub.text}</SubPointText>}
                  </SubPoint>
                ))}
              </ServiceContent>
            </ServiceBlock>
          ))}
        </ServiceGrid>
      </Section>
      
      <ZoneInterventionWrapper>
        <ZoneIntervention />
      </ZoneInterventionWrapper>
      
      <ClientsSection>
        <ClientsTitle>Ils approuvent notre expertise</ClientsTitle>
        <ClientsImage src={clientsImage} alt="Nos clients" />
      </ClientsSection>
    </PageContainer>
  );
};

export default Services; 
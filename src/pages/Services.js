import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Title from '../components/Title';
import Text from '../components/Text';
import ZoneIntervention from '../components/ZoneIntervention';
import procederSvg from '../assets/images/proceder.svg';
import { API_BASE_URL } from '../App';

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem 2rem;
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
  gap: 2.5rem;
  align-items: flex-start;
  position: relative;
  padding: 2rem;
  overflow: visible;
  
  &:nth-child(odd) {
    background-color: var(--color-light-gray, #f5f5f5);
    margin-right: 15%;
  }
  
  &:nth-child(even) {
    background-color: var(--color-light-gray, #f5f5f5);
    margin-left: 15%;
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
  padding-right: 1rem;
  
  @media (max-width: 992px) {
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
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-secondary);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: flex-start;
  text-align: left;

  &::before {
    content: attr(data-number);
    color: var(--color-primary);
    margin-right: 0.75rem;
    font-size: 1rem;
    min-width: 1.5rem;
    text-align: left;
  }

  &:empty {
    display: none;
  }
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
  text-align: left;

  &:empty {
    display: none;
  }
`;

const ZoneInterventionWrapper = styled.div`
  margin: 5rem 0;
`;

const IntroRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }
`;

const IntroTextContainer = styled.div`
  flex: 0 1 66.66%;
  max-width: 66.66%;
`;

const IntroImage = styled.img`
  flex: 0 0 auto;
  width: 200px;
  height: auto;
  max-width: 200px;
  object-fit: contain;
  @media (max-width: 900px) {
    width: 150px;
    max-width: 150px;
    margin: 0 auto;
    display: block;
  }
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
      { title: 'Définition de la trajectoire et de la feuille de route (étapes, livrables, ressources, Planning, Budget)', text: '' },
      { title: 'Mise en place des indicateurs de pilotage de la transformation', text: '' },
      { title: 'Pilotage des risques liés à la transformation', text: '' },
      { title: 'Mise en place de la gouvernance', text: '' },
      { title: 'Maîtrise du Run', text: '' }
    ]
  }
];

const Services = () => {
  const [serviceData, setServiceData] = useState({
    0: 'Cadrage des objectifs et du périmètre du projet. Identification résultats attendus du changement. Choix des parties prenantes du projet. Budget prévisionnel du projet. Planification du projet.',
    1: "Etat des lieux de l'architecture SI et audit du SI et les applicatifs DATA existants. Stratégie et culture actuelle du SI. Diagnostic et audit organisationnel de la DSI. Diagnostic organisationnel, des processus et des méthodes. Evaluation de la dette SI.",
    2: "Définition du projet cible DATA/ BI (Stratégie, Métier, Applicatif et Infrastructures IT). Accompagnement à l'expression des besoins utilisateurs. Accompagnement à l'évolution des usages, processus et des pratiques. Choix et mise en place d'outils « référentiels d'architecture » et les standards de modélisation. Accompagnement au changement.",
    3: 'Définition de la trajectoire et de la feuille de route (étapes, livrables, ressources, Planning, Budget). Mise en place des indicateurs de pilotage de la transformation. Pilotage des risques liés à la transformation. Mise en place de la gouvernance. Maîtrise du Run.'
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/editable-content/services`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.elements) {
          data.elements.forEach(item => {
            // Load paragraph content
            const m = item.element_selector && item.element_selector.match(/\.service-(\d+)-paragraph/);
            if (m && item.element_type === 'paragraph') {
              const sIdx = parseInt(m[1], 10);
              if (sIdx >= 0 && sIdx < 4) {
                setServiceData(prev => ({ ...prev, [sIdx]: item.content_html }));
              }
            }
            
            const element = document.querySelector(item.element_selector);
            if (element) {
              if (item.element_type === 'deleted') {
                element.style.display = 'none';
                return;
              }
              
              if (item.element_type === 'link') {
                const anchor = element.closest('a') || element;
                if (anchor && typeof item.content_html === 'string') {
                  anchor.setAttribute('href', item.content_html);
                }
              } else {
                const target = element.querySelector('.editable-target') || element;
                target.innerHTML = item.content_html;
              }
            }
          });
        }
      } catch (e) {
        // silencieux en public
      }
    };
    // délai pour garantir le DOM
    const t = setTimeout(loadContent, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageContainer>
      <Section>
        <IntroRow>
          <IntroTextContainer>
            <SectionTitle level={1} className="services-main-title">Comment allons-nous procéder ?</SectionTitle>
            <IntroText className="services-intro-text">
              Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers.
            </IntroText>
          </IntroTextContainer>
          <IntroImage src={procederSvg} alt="Procéder illustration" />
        </IntroRow>
      </Section>

      <Section className="content-section">
        <ServiceGrid>
          {[0, 1, 2, 3].map((index) => (
            <ServiceBlock key={index}>
              <ServiceNumber>{index + 1}</ServiceNumber>
              <ServiceContent>
                <ServiceTitle className={`service-${index}-title`}>
                  {index === 0 ? 'Cadrage du projet et du besoin' : 
                   index === 1 ? 'Vision globale et état des lieux du SI' :
                   index === 2 ? 'Evolution du SI Projet cible' : 'Plan de transformation SI'}
                </ServiceTitle>
                <div style={{ textAlign: 'left', width: '100%', marginBottom: '1rem' }}>
                  <p className={`service-${index}-paragraph`} style={{ color: 'var(--color-text)', fontSize: '1rem', lineHeight: 1.6, margin: 0, padding: 0 }}>
                    {serviceData[index] || ''}
                  </p>
                </div>
              </ServiceContent>
            </ServiceBlock>
          ))}
        </ServiceGrid>
      </Section>
      
      <ZoneInterventionWrapper>
        <ZoneIntervention />
      </ZoneInterventionWrapper>
    </PageContainer>
  );
};

export default Services; 
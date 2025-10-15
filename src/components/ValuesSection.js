import React, { useEffect } from 'react';
import styled from 'styled-components';
import ValueCard from './ValueCard';
import Title from './Title';
import { API_BASE_URL } from '../App';

// Import des animations Lottie
import animation1 from '../assets/animations/animation2.json';
import animation2 from '../assets/animations/animation5.json';
import animation3 from '../assets/animations/animation6.json';

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

const ValuesSection = () => {
  // Données des cartes de valeurs
  const valuesData = [
    {
      title: "Valeurs Sociales",
      lottieFile: animation1,
      iconAlt: "Animation représentant des connexions sociales",
      type: "social",
      paragraph: "Placer l'humain au cœur du processus de transformation: (écoute, implication, co-construction, acteurs du changement). Protéger des données individuelles."
    },
    {
      title: "Valeurs écologiques",
      lottieFile: animation2,
      iconAlt: "Animation représentant les valeurs écologiques",
      type: "eco",
      paragraph: "Infrastructures et équipements responsables (longévité, réparabilité, évolutivité). Gestion sobre des données (collecte optimisée, conservation raisonnée). Optimisation des flux pour réduire l'empreinte énergétique. Conformité réglementaire sur la durée de vie des données."
    },
    {
      title: "Innovation et pratiques agiles",
      lottieFile: animation3,
      iconAlt: "Animation représentant l'innovation",
      type: "innovation",
      paragraph: "Des architectures IT évolutives. Approches Data centric. Approches agiles et collaboratives."
    }
  ];

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/editable-content/valeurs`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.elements?.length) {
          // Load saved paragraph content
          data.elements.forEach(item => {
            const m = item.element_selector && item.element_selector.match(/\.valeur-(\d+)-paragraph/);
            if (m && item.element_type === 'paragraph') {
              const vIdx = parseInt(m[1], 10);
              const el = document.querySelector(item.element_selector);
              if (el) {
                el.textContent = item.content_html;
              }
            }
          });
        }
        data.elements?.forEach(item => {
          const el = document.querySelector(item.element_selector);
          if (el) {
            if (item.element_type === 'deleted') {
              el.style.display = 'none';
              return;
            }
            
            if (item.element_type === 'link') {
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
      } catch {}
    };
    const t = setTimeout(loadContent, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={1} align="center" variant="page-title" className="valeurs-title">Nos valeurs</Title>
      </TitleContainer>
      <Description className="valeurs-description">
        L'objectif, c'est de fournir du conseil pour des solutions IT responsables qui allient:
      </Description>
      
      <CardsContainer>
        {valuesData.map((card, index) => (
          <ValueCard 
            key={index}
            title={card.title}
            lottieFile={card.lottieFile}
            iconAlt={card.iconAlt}
            paragraph={card.paragraph}
            type={card.type}
            classNamePrefix={`valeur-${index}`}
          />
        ))}
      </CardsContainer>
    </SectionContainer>
  );
};

export default ValuesSection; 
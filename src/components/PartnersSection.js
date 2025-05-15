import React from 'react';
import styled from 'styled-components';
import Title from './Title';
import partenairesImage from '../assets/images/partenaires.png';

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

const PartnersContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 100%;
`;

const PartnersImage = styled.img`
  max-width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
  
  /* Fallback pour les images qui ne se chargent pas */
  &.error {
    display: none;
  }
`;

const FallbackText = styled.div`
  display: none;
  text-align: center;
  color: var(--color-tertiary);
  padding: 2rem;
  
  &.visible {
    display: block;
  }
`;

const PartnersSection = () => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={1} align="center" variant="page-title">Nos partenaires</Title>
      </TitleContainer>
      <SectionDescription>
        Rim conseil coopère avec des entreprises partenaires pour diversifier les services proposés. 
        Grâce à notre réseau de partenaires experts dans différents domaines, nous sommes en mesure 
        d'offrir des solutions complètes qui répondent à tous vos besoins informatiques et stratégiques.
      </SectionDescription>
      
      <PartnersContainer>
        <PartnersImage 
          src={partenairesImage} 
          alt="Nos partenaires: Parteam, Bevoak, Blocnet, Polynom, Colibee, IBM" 
          className={imageError ? 'error' : ''}
          onError={handleImageError}
        />
        <FallbackText className={imageError ? 'visible' : ''}>
          Nos partenaires incluent Parteam, Bevoak, Blocnet, Polynom, Colibee et IBM, qui nous permettent
          d'offrir une gamme complète de services informatiques et stratégiques.
        </FallbackText>
      </PartnersContainer>
    </SectionContainer>
  );
};

export default PartnersSection; 
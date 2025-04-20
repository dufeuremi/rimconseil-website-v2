import React from 'react';
import styled from 'styled-components';
import Title from './Title';
import clientsImage from '../assets/images/clients.png';

const SectionContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 3rem;
  text-align: center;
`;

const ClientsImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClientsImage = styled.img`
  max-width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
`;

const FallbackText = styled.div`
  display: none;
  text-align: center;
  color: var(--color-tertiary);
  padding: 2rem;
  font-style: italic;
  
  &.visible {
    display: block;
  }
`;

const ClientsSection = () => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <SectionContainer>
      <SectionTitle>Ils approuvent notre expertise</SectionTitle>
      
      <ClientsImageContainer>
        <ClientsImage 
          src={clientsImage} 
          alt="Nos clients" 
          className={imageError ? 'error' : ''}
          onError={handleImageError}
        />
        <FallbackText className={imageError ? 'visible' : ''}>
          Nos clients incluent des entreprises de divers secteurs qui nous font confiance
          pour leurs projets de transformation numérique.
        </FallbackText>
      </ClientsImageContainer>
    </SectionContainer>
  );
};

export default ClientsSection; 
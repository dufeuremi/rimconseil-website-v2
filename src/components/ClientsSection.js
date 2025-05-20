import React from 'react';
import styled from 'styled-components';
import Title from './Title';
import client1 from '../assets/images/client1.svg';
import client2 from '../assets/images/client2.svg';

const SectionContainer = styled.section`
  background-color: #303947;
  background-image: url(${require('../assets/images/texturewaves.jpg')});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-blend-mode: multiply;
  filter: brightness(0.8);
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 8rem;
  padding-top: 5rem;
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 3rem;
  text-align: center;
`;

const ClientsImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClientsLogosRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  width: 100%;
  margin: 0 auto;
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
        <ClientsLogosRow>
          <img src={client1} alt="Client 1" style={{ height: '80px', width: 'auto' }} />
          <img src={client2} alt="Client 2" style={{ height: '80px', width: 'auto' }} />
        </ClientsLogosRow>
        <FallbackText className={imageError ? 'visible' : ''}>
          Nos clients incluent des entreprises de divers secteurs qui nous font confiance
          pour leurs projets de transformation numérique.
        </FallbackText>
      </ClientsImageContainer>
    </SectionContainer>
  );
};

export default ClientsSection; 
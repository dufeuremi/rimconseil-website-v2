import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import Button from '../components/Button';

const NotFoundContainer = styled.div`
  min-height: calc(100vh - 150px - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
`;

const ErrorCode = styled.div`
  font-size: 8rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--color-text);
  max-width: 500px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const NotFound = () => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <NotFoundContainer>
      <Title level={1} align="center" variant="page-title">
        Page non trouvée
      </Title>

      <Description>
        La page que vous recherchez n'existe pas ou a été déplacée.
        Veuillez vérifier l'URL ou revenir à la page d'accueil.
      </Description>
      <ButtonContainer>
        <Button onClick={() => navigate('/')} arrow={true}>
          Retour à l'accueil
        </Button>

      </ButtonContainer>
    </NotFoundContainer>
  );
};

export default NotFound; 
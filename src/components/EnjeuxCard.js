import React, { useState } from 'react';
import styled from 'styled-components';
import { RiArrowRightLine } from 'react-icons/ri';
import Button from './Button';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background-color: var(--color-white);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 140px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const FallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    // Utilisation des nouvelles couleurs
    const colors = [
      'var(--color-dark-green)',
      'var(--color-medium-green)',
      'var(--color-light-green)',
      'var(--color-beige)'
    ];
    return colors[props.colorIndex % colors.length];
  }};
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
`;

const Title = styled.h3`
  color: var(--color-secondary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: var(--color-text-light);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const EnjeuxCard = ({ title, description, link, image, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Extraire les initiales pour le fallback
  const getInitials = () => {
    if (!title) return '?';
    return title
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <CardContainer>
      {image && (
        <ImageContainer>
          {!imageError ? (
            <CardImage 
              src={image} 
              alt={title} 
              onError={handleImageError}
            />
          ) : (
            <FallbackContainer colorIndex={index}>
              {getInitials()}
            </FallbackContainer>
          )}
        </ImageContainer>
      )}
      <Title>{title}</Title>
      <Description>{description}</Description>
      <ButtonContainer>
        <Button arrow={true}>
          Découvrir
        </Button>
      </ButtonContainer>
    </CardContainer>
  );
};

export default EnjeuxCard; 
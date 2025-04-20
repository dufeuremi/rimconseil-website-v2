import React, { useState } from 'react';
import styled from 'styled-components';
import { RiArrowRightLine } from 'react-icons/ri';
import Button from './Button';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #F4F9FF;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  background-color: ${props => props.theme.colors.lightBg};
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.textLight};
  margin: 0;
`;

const ButtonContainer = styled.div`
  margin-top: 1.5rem;
`;

const EnjeuxCard = ({ data, title: propTitle, description: propDescription, image: propImage, link: propLink, index = 0 }) => {
  const title = propTitle || (data && data.title) || '';
  const description = propDescription || (data && data.description) || '';
  const image = propImage || (data && data.image) || '';
  const link = propLink || (data && data.link) || '';
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const getInitials = () => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <CardContainer>
      <ImageContainer>
        {!imageError ? (
          <Image 
            src={image} 
            alt={title} 
            onError={handleImageError}
          />
        ) : (
          <ImageFallback>
            {getInitials()}
          </ImageFallback>
        )}
      </ImageContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {link && (
        <ButtonContainer>
          <Button to={link} arrow={true}>
            Découvrir
          </Button>
        </ButtonContainer>
      )}
    </CardContainer>
  );
};

export default EnjeuxCard; 
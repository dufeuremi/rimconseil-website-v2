import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { RiArrowRightLine, RiCloseLine } from 'react-icons/ri';
import Button from './Button';

const CardContainer = styled.div`
  display: flex;
flex-direction: column;
align-items: center;
text-align: center;
padding: 1.5rem;
background: linear-gradient(to bottom, transparent,rgba(255, 255, 255, 0.06));
position: relative;
overflow: hidden;
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
  background-color:rgba(244, 249, 255, 0.04);
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
    color: var(--color-text-light);
  background-color: ${props => props.theme.colors.lightBg};
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #fff;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
`;

const ButtonContainer = styled.div`
  margin-top: 1.5rem;
`;

// Styles pour la popup inspirés de ValueCard
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 2rem;
  background: linear-gradient(to bottom, #fff 60%, #f6fbff 100%);
  border-radius: 12px;
  border: 1px solid #e6f0fa;
  box-shadow: 0 4px 24px rgba(0, 32, 72, 0.08);
  position: relative;
  overflow: hidden;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text-light);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const PopupTitle = styled.h3`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const PopupDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const ListItem = styled.li`
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-light);
  font-size: 1rem;
  line-height: 1.5;

  &:before {
    content: attr(data-number);
    position: absolute;
    left: 0;
    color: var(--color-text-light);
  }
`;

const PopupButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const EnjeuxCard = ({ data, title: propTitle, description: propDescription, image: propImage, link: propLink, index = 0, details = [] }) => {
  const title = propTitle || (data && data.title) || '';
  const description = propDescription || (data && data.description) || '';
  const image = propImage || (data && data.image) || '';
  const link = propLink || (data && data.link) || '';
  const [imageError, setImageError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
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
  
  // Générer les symboles pour les numéros de liste
  const getNumberSymbol = (index) => {
    const symbols = ['①', '②', '③', '④', '⑤'];
    return symbols[index] || `${index + 1}`;
  };
  
  const openPopup = () => {
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden'; // Empêcher le défilement du corps
  };
  
  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = ''; // Restaurer le défilement du corps
  };

  // Simuler des détails pour la popup si aucun n'est fourni
  const popupDetails = details.length > 0 ? details : [
    "Analyse des besoins spécifiques",
    "Définition de la stratégie appropriée",
    "Mise en œuvre des solutions",
    "Suivi et optimisation continue"
  ];

  // Effet pour gérer la pression de la touche Escape pour fermer la popup
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isPopupOpen) {
        closePopup();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isPopupOpen]);

  return (
    <>
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
        <ButtonContainer>

          {link && (
            <Button to={link} arrow={true} style={{ marginLeft: '0.5rem' }}>
              Découvrir
            </Button>
          )}
        </ButtonContainer>
      </CardContainer>
      
      {/* Popup avec le style de ValueCard */}
      <PopupOverlay isOpen={isPopupOpen} onClick={closePopup}>
        <PopupContainer onClick={(e) => e.stopPropagation()}>
          <PopupCloseButton onClick={closePopup}>
            <RiCloseLine />
          </PopupCloseButton>
          <PopupTitle>{title}</PopupTitle>
          <PopupDescription>{description}</PopupDescription>
          
          <ListContainer>
            {popupDetails.map((item, index) => (
              <ListItem key={index} data-number={getNumberSymbol(index)}>
                {item}
              </ListItem>
            ))}
          </ListContainer>
          
          <PopupButtonContainer>
            {link && (
              <Button to={link} arrow={true}>
                Découvrir
              </Button>
            )}
          </PopupButtonContainer>
        </PopupContainer>
      </PopupOverlay>
    </>
  );
};

export default EnjeuxCard; 
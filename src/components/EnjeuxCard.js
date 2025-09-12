import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { RiArrowRightLine, RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Button from './Button';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.06));
  position: relative;
  overflow: hidden;
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

const EnjeuxCard = ({ data, title: propTitle, description: propDescription, link: propLink, index = 0, details = [], classNamePrefix = '', renderTitle, renderDescription, renderButton, renderDetail, ctaLinks = {}, showLinkPicker, setShowLinkPicker, saveLink }) => {
  const title = propTitle || (data && data.title) || '';
  const description = propDescription || (data && data.description) || '';
  const link = propLink || (data && data.link) || '';
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Générer les symboles pour les numéros de liste
  const getNumberSymbol = (index) => {
    const symbols = ['①', '②', '③', '④', '⑤'];
    return symbols[index] || `${index + 1}`;
  };
  
  const openPopup = () => {
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = '';
  };

  const popupDetails = details.length > 0 ? details : [
    "Analyse des besoins spécifiques",
    "Définition de la stratégie appropriée",
    "Mise en œuvre des solutions",
    "Suivi et optimisation continue"
  ];

  useEffect(() => {
    const handleEscapeKey = (e) => { if (e.key === 'Escape' && isPopupOpen) closePopup(); };
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isPopupOpen]);

  const defaultTitleEl = (
    <Title className={classNamePrefix ? `${classNamePrefix}-title` : undefined}>{title}</Title>
  );
  const defaultDescEl = (
    <Description className={classNamePrefix ? `${classNamePrefix}-description` : undefined}>{description}</Description>
  );

  return (
    <>
      <CardContainer>
        {renderTitle ? renderTitle(defaultTitleEl) : defaultTitleEl}
        {renderDescription ? renderDescription(defaultDescEl) : defaultDescEl}
        <ButtonContainer>
          {link && (
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button 
                as={Link}
                to={ctaLinks[`.enjeu-${index}-cta`] || link} 
                arrow={true} 
                style={{ marginLeft: '0.5rem' }}
                onClick={(e) => {
                  // Empêcher la redirection si on clique sur le texte éditable
                  if (e.target.closest('.editable')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                {renderButton ? renderButton(<span className={`enjeu-${index}-cta`}>Découvrir</span>) : <span className={`enjeu-${index}-cta`}>Découvrir</span>}
              </Button>
              
              {/* Indicateur de lien au survol */}
              {showLinkPicker && setShowLinkPicker && (
                <div 
                  className="link-indicator"
                  style={{
                    position: 'absolute',
                    right: '-2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: 'var(--color-primary)',
                    background: 'white',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 10
                  }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowLinkPicker({ key: `.enjeu-${index}-cta` }); }}
                  title={ctaLinks[`.enjeu-${index}-cta`] ? `Lien: ${ctaLinks[`.enjeu-${index}-cta`]}` : 'Cliquer pour choisir un lien'}
                >
                  🔗
                </div>
              )}
            </div>
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
            {popupDetails.map((item, detailIndex) => {
              const defaultDetailEl = (
                <ListItem key={detailIndex} className={`${classNamePrefix ? classNamePrefix + '-detail-' + detailIndex : ''}`} data-number={getNumberSymbol(detailIndex)}>
                  {item}
                </ListItem>
              );
              return typeof renderDetail === 'function' ? renderDetail(defaultDetailEl, detailIndex) : defaultDetailEl;
            })}
          </ListContainer>
          
          <PopupButtonContainer>
            {link && (
              <Button as={Link} to={ctaLinks[`.enjeu-${index}-cta`] || link} arrow={true}>
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

// CSS global pour les indicateurs de lien
const GlobalStyles = () => (
  <style jsx global>{`
    .link-indicator {
      opacity: 0 !important;
    }
    div:hover .link-indicator {
      opacity: 1 !important;
    }
  `}</style>
); 
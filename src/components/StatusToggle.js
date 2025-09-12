import React, { useState } from 'react';
import styled from 'styled-components';
import SuccessPopup from './SuccessPopup';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 40px;
  height: 20px;
  background-color: ${props => props.isOnline ? 'var(--color-primary)' : '#6c757d'};
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.isOnline ? '22px' : '2px'};
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ToggleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const ToggleLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.isOnline ? 'var(--color-primary)' : '#6c757d'};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ToggleDescription = styled.span`
  font-size: 0.7rem;
  color: #9ca3af;
`;

const StatusToggle = ({ 
  isOnline = true, 
  onToggle,
  id, // Add id prop
  description = "Publier/dépublier ce contenu",
  className = ""
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleToggle = () => {
    const newStatus = !isOnline;
    const statusText = newStatus ? 'en ligne' : 'hors ligne';
    
    if (onToggle) {
      onToggle(id, newStatus); // Pass both id and newStatus
    }
    
    setPopupMessage(`Document mis ${statusText} avec succès`);
    setShowPopup(true);
  };

  return (
    <>
      <SuccessPopup
        message={popupMessage}
        show={showPopup}
        onHide={() => setShowPopup(false)}
        duration={2000}
      />
      
      <ToggleContainer>
        <ToggleSwitch isOnline={isOnline} onClick={handleToggle}>
          <ToggleSlider isOnline={isOnline} />
        </ToggleSwitch>
        <ToggleInfo>
          <ToggleLabel isOnline={isOnline}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </ToggleLabel>
          {description && <ToggleDescription>{description}</ToggleDescription>}
        </ToggleInfo>
      </ToggleContainer>
    </>
  );
};

export default StatusToggle; 
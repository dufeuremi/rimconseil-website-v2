import React, { useState, useEffect } from 'react';
import { RiShieldCheckLine } from 'react-icons/ri';
import styled from 'styled-components';
import Button from './Button';
import './CookieConsent.css';

const CookieConsentWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <CookieConsentWrapper className={isVisible ? 'visible' : 'hidden'}>
      <div className="consent-container">
        <div className="consent-icon">
          <RiShieldCheckLine />
        </div>
        <div className="consent-content">
          <h3>Utilisation des cookies</h3>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous acceptez notre utilisation des cookies.
          </p>
        </div>
        <div className="consent-actions">
          <Button type="button" onClick={handleAccept}>
            Accepter
          </Button>
          <Button type="button" variant="secondary" onClick={handleDecline}>
            Décliner
          </Button>
        </div>
      </div>
    </CookieConsentWrapper>
  );
};

export default CookieConsent; 
import React, { useState, useEffect } from 'react';
import { RiShieldCheckLine } from 'react-icons/ri';
import styled from 'styled-components';
import Button from './Button';

const CookieConsentWrapper = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  max-width: 500px;
  background-color: white;
  border: 1px solid var(--color-quaternary);
  padding: 1.5rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.5s ease-out;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  text-align: left;

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
  }
`;

const CookieIcon = styled(RiShieldCheckLine)`
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const CookieContent = styled.div`
  flex: 1;
  text-align: left;
`;

const CookieTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: var(--color-secondary);
  font-weight: 600;
  text-align: left;
`;

const CookieText = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-secondary);
  text-align: left;
`;

const CookieActions = styled.div`
  display: flex;
  justify-content: flex-start;
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

  if (!isVisible) return null;

  return (
    <CookieConsentWrapper>
      <CookieIcon />
      <CookieContent>
        <CookieTitle>Utilisation des cookies</CookieTitle>
        <CookieText>
          Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
          En continuant à naviguer, vous acceptez notre utilisation des cookies.
        </CookieText>
        <CookieActions>
          <Button onClick={handleAccept} small>
            Accepter
          </Button>
        </CookieActions>
      </CookieContent>
    </CookieConsentWrapper>
  );
};

export default CookieConsent; 
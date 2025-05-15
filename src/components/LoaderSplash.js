import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import logoWhite from '../assets/images/logoWhite.svg';

const fadeOut = keyframes`
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const SplashScreen = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.7s;
  opacity: ${props => (props.hide ? 0 : 1)};
  pointer-events: ${props => (props.hide ? 'none' : 'all')};
  animation: ${props => props.hide ? fadeOut : 'none'} 0.7s forwards;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  @media (max-width: 600px) {
    width: 80px;
  }
`;

const LoaderSplash = () => {
  const [hide, setHide] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // On attend que le site soit chargé (ici 1.2s, ajustable)
    const timer = setTimeout(() => setHide(true), 1200);
    let removeTimer;
    if (hide) {
      removeTimer = setTimeout(() => setRemoved(true), 700); // durée du fade
    }
    return () => {
      clearTimeout(timer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [hide]);

  if (removed) return null;

  return (
    <SplashScreen hide={hide}>
      <Logo src={logoWhite} alt="Logo Rim Conseil" />
    </SplashScreen>
  );
};

export default LoaderSplash; 
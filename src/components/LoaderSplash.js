import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import logoAnimation from '../assets/logo_animation.json';

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
`;

const AnimationContainer = styled.div`
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-10%); /* Ajustement fin du centrage vertical */
`;

const LoaderSplash = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lottieRef = React.useRef(null);

  useEffect(() => {
    // Attendre que toutes les images soient chargées
    const images = document.querySelectorAll('img');
    let loadedImages = 0;

    const handleImageLoad = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        // Attendre un peu plus pour assurer une transition fluide
        setTimeout(() => {
          setIsVisible(false);
        }, 300); // Réduit de 500ms à 300ms
      }
    };

    // Si aucune image n'est présente, on cache quand même le loader après un délai
    if (images.length === 0) {
      setTimeout(() => {
        setIsVisible(false);
      }, 1500); // Réduit de 2000ms à 1500ms
    } else {
      images.forEach(img => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    }

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <LoaderWrapper isVisible={isVisible}>
      <AnimationContainer>
        <Lottie
          animationData={logoAnimation}
          loop={false}
          autoplay={true}
          lottieRef={lottieRef}
          onComplete={() => {
            if (lottieRef.current) {
              lottieRef.current.goToAndStop(lottieRef.current.getDuration(true), true);
            }
          }}
        />
      </AnimationContainer>
    </LoaderWrapper>
  );
};

export default LoaderSplash; 
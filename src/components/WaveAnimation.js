import React, { useRef } from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import maskAnimation from '../assets/animations/mask.json';

const WaveContainer = styled.div`
  position: absolute;
  left: 0;
  width: 100vw;
  height: 80px;
  pointer-events: none;
  overflow: visible;
  z-index: 2;
  /* Masquer le haut du Lottie pour ne garder que la vague */
  mask-image: linear-gradient(to top, black 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, black 60%, transparent 100%);
  margin: 0;
  padding: 0;
`;

const WaveAnimation = ({ position = 'bottom' }) => {
  const lottieRef = useRef();
  const directionRef = useRef(1);

  // Fonction pour gérer l'aller-retour
  const handleLottieComplete = () => {
    if (lottieRef.current && lottieRef.current.animationItem) {
      directionRef.current = -directionRef.current;
      lottieRef.current.animationItem.setDirection(directionRef.current);
      lottieRef.current.animationItem.setSpeed(0.5);
      lottieRef.current.animationItem.play();
    }
  };

  return (
    <WaveContainer style={{ [position]: 0 }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={maskAnimation}
        loop={false}
        autoplay
        onComplete={handleLottieComplete}
        style={{ 
          width: '100vw', 
          height: '100%', 
          transform: `scaleY(${position === 'top' ? '-0.165' : '0.165'}) translateY(${position === 'top' ? '80px' : '2px'})`, 
          transformOrigin: 'bottom', 
          filter: 'brightness(0) invert(1)',
          margin: 0,
          padding: 0
        }}
        rendererSettings={{ preserveAspectRatio: 'none' }}
        speed={0.5}
      />
    </WaveContainer>
  );
};

export default WaveAnimation; 
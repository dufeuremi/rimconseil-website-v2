import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  20% {
    transform: translateY(0);
    opacity: 1;
  }
  80% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const PopupContent = styled.div`
  padding: 10px 20px;
  margin-top: 20px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  max-width: 90%;
  animation: ${slideDown} ${props => props.duration + 500}ms ease-in-out forwards;
  display: flex;
  align-items: center;
`;

const SuccessIcon = styled.span`
  margin-right: 12px;
  font-size: 1.2rem;
`;

/**
 * Success popup notification that slides down from the top, stays visible briefly, then slides back up
 * @param {Object} props
 * @param {string} props.message - Message to display
 * @param {boolean} props.show - Whether to show the popup
 * @param {function} props.onHide - Callback when popup is hidden
 * @param {number} props.duration - Duration to show in ms (default: 2000)
 */
const SuccessPopup = ({ message, show, onHide, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show && !isVisible) {
      setIsVisible(true);

      // Set a timer to remove the component after animation
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        if (onHide) onHide();
      }, duration + 500); // Adding 500ms for the animation

      return () => {
        clearTimeout(hideTimer);
      };
    }
  }, [show, duration, onHide, isVisible]);

  if (!isVisible && !show) return null;

  return (
    <PopupContainer>
      <PopupContent duration={duration}>
        <SuccessIcon>✓</SuccessIcon>
        {message}
      </PopupContent>
    </PopupContainer>
  );
};

export default SuccessPopup; 
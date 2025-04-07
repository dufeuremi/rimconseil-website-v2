import React, { useEffect } from 'react';
import styled from 'styled-components';
import './Modal.css';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(30, 40, 55, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background-color: white;
  border: 1px solid var(--color-quaternary);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-tertiary);
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    // Bloquer le scroll du body quand la modal est ouverte
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Nettoyer à la destruction du composant
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Gestion de l'événement d'échappement pour fermer la modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal; 
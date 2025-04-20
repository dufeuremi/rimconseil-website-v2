import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(30, 40, 55, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background-color: white;
  border: 1px solid var(--color-quaternary);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: var(--color-secondary);
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
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const DangerStyle = {
  backgroundColor: '#d32f2f',
  borderColor: '#d32f2f'
};

/**
 * A reusable confirmation dialog component.
 * @param {Object} props - Component props
 * @param {string} props.title - Dialog title
 * @param {string|ReactNode} props.children - Dialog content
 * @param {boolean} props.isOpen - Whether dialog is visible
 * @param {function} props.onClose - Function to call when closing
 * @param {function} props.onConfirm - Function to call when confirming
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {boolean} props.danger - Whether this is a dangerous action
 * @param {boolean} props.isLoading - Whether the confirm action is loading
 */
const ConfirmationDialog = ({
  title,
  children,
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  danger = false,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <div>{children}</div>

        <ButtonsContainer>
          {cancelText && (
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={onConfirm}
            disabled={isLoading}
            style={danger ? DangerStyle : {}}
          >
            {isLoading ? 'Chargement...' : confirmText}
          </Button>
        </ButtonsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationDialog; 
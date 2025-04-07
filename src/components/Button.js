import React from 'react';
import styled from 'styled-components';
import { RiArrowRightLine } from 'react-icons/ri';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: ${props => props.arrow ? 'space-between' : 'center'};
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: ${props => props.small ? '0.875rem' : '1rem'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  border-radius: 0;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;

  .arrow-icon {
    transition: transform 0.3s ease;
  }

  /* Primary Button (Default) */
  background: linear-gradient(45deg, var(--color-primary) 0%, var(--color-primarylight) 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:hover .arrow-icon {
    transform: translateX(4px);
  }

  /* Secondary Button */
  ${props => props.variant === 'secondary' && `
    background: white;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background: var(--color-primary);
      color: white;
    }
  `}

  /* Danger Button */
  ${props => props.variant === 'danger' && `
    background: white;
    color: var(--color-danger);
    border: 1px solid var(--color-danger);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background: var(--color-danger);
      color: white;
    }
  `}

  /* Ghost Button */
  ${props => props.variant === 'ghost' && `
    background: transparent;
    color: var(--color-text);
    padding: 0.5rem 1rem;

    &:hover {
      background: var(--color-quaternary);
      transform: translateY(0);
      box-shadow: none;
    }
  `}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  fullWidth = false,
  small = false,
  arrow = false,
  disabled = false,
  onClick,
  className
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      small={small}
      arrow={arrow}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      <span>{children}</span>
      {arrow && <RiArrowRightLine className="arrow-icon" />}
    </StyledButton>
  );
};

export default Button; 
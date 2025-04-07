import React from 'react';
import styled from 'styled-components';

const Tag = styled.div`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  margin: 0.5rem;
  background-color: ${props => props.active ? 'var(--color-primary, #3071E7)' : 'var(--color-white)'};
  border: 1px solid ${props => props.active ? 'var(--color-primary, #3071E7)' : 'var(--color-quaternary)'};
  font-size: 0.9rem;
  color: ${props => props.active ? 'var(--color-white)' : 'var(--color-tertiary)'};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: var(--color-primary);
    color: ${props => props.active ? 'var(--color-white)' : 'var(--color-primary)'};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const LocationTag = ({ name, onMouseEnter, onMouseLeave, onClick, active }) => {
  return (
    <Tag 
      onMouseEnter={(e) => onMouseEnter && onMouseEnter(name, e)}
      onMouseLeave={(e) => onMouseLeave && onMouseLeave(name, e)}
      onClick={(e) => onClick && onClick(name, e)}
      active={active}
    >
      {name}
    </Tag>
  );
};

export default LocationTag; 
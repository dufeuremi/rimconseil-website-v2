import React from 'react';
import styled from 'styled-components';
import './Title.css';

// Styled component pour la variante page-title
const PageTitle = styled.h1`
  font-family: var(--font-primary);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 1.5rem 0 2rem 0;
  color: #000;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin: 1.25rem 0 1.75rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin: 1rem 0 1.5rem 0;
  }
`;

const Title = ({ level = 1, children, className = '', align = 'left', variant, ...props }) => {
  // Si la variante est page-title, utiliser le composant stylé
  if (variant === 'page-title') {
    return <PageTitle className={className} {...props}>{children}</PageTitle>;
  }
  
  // Sinon, utiliser le rendu standard
  const Component = `h${level}`;
  return (
    <Component 
      className={`title-${level} title-${align} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Title; 
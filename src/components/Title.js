import React from 'react';
import './Title.css';

const Title = ({ level = 1, children, className = '', align = 'left', ...props }) => {
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
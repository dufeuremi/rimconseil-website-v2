import React from 'react';
import './Link.css';

const Link = ({ children, href, className = '', ...props }) => {
  return (
    <a 
      className={`link ${className}`}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link; 
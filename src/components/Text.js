import React from 'react';
import './Text.css';

const Text = ({ variant = 'body', children, className = '', align = 'left', ...props }) => {
  return (
    <p 
      className={`text text-${variant} text-${align} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export default Text; 
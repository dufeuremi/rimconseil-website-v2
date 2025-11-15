import React from 'react';
import './ErrorDialog.css';

const ErrorDialog = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="error-dialog-backdrop">
      <div className="error-dialog">
        <div className="error-dialog-message">{message}</div>
        <button className="error-dialog-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default ErrorDialog;

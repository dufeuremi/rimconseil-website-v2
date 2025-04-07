import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import './BugReportModal.css';

const BugReportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Traitement du formulaire ici
    console.log('Bug report submitted:', formData);
    // Réinitialiser le formulaire
    setFormData({ name: '', email: '', message: '' });
    // Fermer la modale
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Signaler un problème">
      <form className="bug-report-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea 
            id="message" 
            name="message" 
            value={formData.message} 
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            Envoyer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BugReportModal; 
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import SuccessPopup from './SuccessPopup';
import './BugReportModal.css';

const BugReportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/send-email`, 
        { texte: formData.message },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Réinitialiser le formulaire
      setFormData({ message: '' });
      // Afficher la popup de succès
      setShowSuccessPopup(true);
      // Fermer la modale après un court délai
      setTimeout(() => {
        onClose();
        setShowSuccessPopup(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du rapport.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Signaler une panne">
        <form className="bug-report-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <textarea 
              id="message" 
              name="message" 
              value={formData.message} 
              onChange={handleChange}
              rows="5"
              placeholder="Décrivez la panne rencontrée..."
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </div>
        </form>
      </Modal>

      <SuccessPopup
        message="Votre rapport a été envoyé avec succès"
        show={showSuccessPopup}
        onHide={() => setShowSuccessPopup(false)}
        duration={2000}
      />
    </>
  );
};

export default BugReportModal; 
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
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
      // Récupérer les informations utilisateur
      const userEmail = localStorage.getItem('userEmail') || 'utilisateur-inconnu';
      const userName = localStorage.getItem('userName') || 'Utilisateur';
      
      // Créer le contenu de l'email
      const subject = encodeURIComponent('⚠️ Rapport de panne - Dashboard Rimconseil');
      const body = encodeURIComponent(
        `Rapport de panne envoyé depuis le dashboard Rimconseil\n\n` +
        `📅 Date: ${new Date().toLocaleString('fr-FR')}\n` +
        `👤 Utilisateur: ${userName} (${userEmail})\n` +
        `🔗 Page: ${window.location.href}\n\n` +
        `📝 Description du problème:\n${formData.message}\n\n` +
        `---\n` +
        `Cet email a été généré automatiquement depuis le système de rapport de panne.`
      );
      
      // Ouvrir le client email par défaut
      window.location.href = `mailto:rdufeu@taskalys.fr?subject=${subject}&body=${body}`;
      
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
      console.error('Erreur:', err);
      const errorMessage = err.message || 'Erreur lors de l\'ouverture du client email';
      alert(`Erreur: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Signaler une panne">
        <form className="bug-report-form" onSubmit={handleSubmit}>
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
        message="Votre client email va s'ouvrir pour envoyer le rapport"
        show={showSuccessPopup}
        onHide={() => setShowSuccessPopup(false)}
        duration={2000}
      />
    </>
  );
};

export default BugReportModal; 
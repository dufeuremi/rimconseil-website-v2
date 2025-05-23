import React, { useState } from 'react';
import styled from 'styled-components';
import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react';
import axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Text from '../components/Text';
import Title from '../components/Title';
import SuccessPopup from '../components/SuccessPopup';
import { API_BASE_URL } from '../App';

const ContactContainer = styled.div`
  padding: 8rem 2rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactHeader = styled.div`
  text-align: left;
  margin-bottom: 3rem;
`;

const ContactSubtitle = styled(Text)`
  font-size: 1.125rem;
  max-width: 600px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: 0;
  text-align: left;

  svg {
    font-size: 1.5rem;
    color: var(--color-primary);
  }
`;

const InfoContent = styled.div`
  text-align: left;

  h3 {
    color: var(--color-secondary);
    margin-bottom: 0.5rem;
    text-align: left;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: 0;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1rem;
  text-align: left;
`;

const ErrorMessage = styled.div`
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid #e53e3e;
  font-size: 0.9rem;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setShowSuccessPopup(false);

    try {
      // Format du message selon la spécification
      const messageData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        sujet: formData.sujet,
        message: formData.message,
        date: new Date().toISOString(), // Date actuelle au format ISO
        status: 0 // Par défaut, le statut est 0 (non traité)
      };

      // Envoi de la requête POST à l'API
      const response = await axios.post(`${API_BASE_URL}/api/messages`, messageData);

      // Afficher le popup de succès plutôt que le message statique
      setSuccessMessage('Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
      setShowSuccessPopup(true);
      
      // Réinitialisation du formulaire
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });

      console.log('Message envoyé avec succès:', response.data);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer ultérieurement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <Title level={1} align="left">Contactez-nous</Title>
        <ContactSubtitle>
          Nous vous répondrons dans les plus brefs délais.
        </ContactSubtitle>
      </ContactHeader>

      <ContactGrid>
        <ContactForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormRow>
            <Input
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
            <Input
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </FormRow>

          <FormRow>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </FormRow>

          <Input
            label="Sujet"
            name="sujet"
            value={formData.sujet}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <FormActions>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </FormActions>
        </ContactForm>

        <ContactInfo>
          <InfoCard>
            <MapPin />
            <InfoContent>
              <h3>Adresse</h3>
              <Text>7 RUE GOUNOD<br />35000 RENNES</Text>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <EnvelopeSimple />
            <InfoContent>
              <h3>Email</h3>
              <Text as="a" href="mailto:info@rimconseil.fr" style={{ textDecoration: 'none' }}>
                info@rimconseil.fr
              </Text>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <Phone />
            <InfoContent>
              <h3>Téléphone</h3>
              <Text>+33 (0)2 99 00 00 00</Text>
            </InfoContent>
          </InfoCard>
        </ContactInfo>
      </ContactGrid>

      <SuccessPopup 
        show={showSuccessPopup} 
        message={successMessage} 
        onHide={() => setShowSuccessPopup(false)}
        duration={3000} // 3 secondes d'affichage
      />
    </ContactContainer>
  );
};

export default Contact; 
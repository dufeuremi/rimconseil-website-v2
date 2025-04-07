import React, { useState } from 'react';
import styled from 'styled-components';
import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Text from '../components/Text';
import Title from '../components/Title';

const ContactContainer = styled.div`
  padding: 2rem;
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

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
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
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <Title level={1} align="left">Contactez-nous</Title>
        <ContactSubtitle>
          Nous vous repondrerons dans les plus brefs délais.
        </ContactSubtitle>
      </ContactHeader>

      <ContactGrid>
        <ContactForm onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Nom"
              name="lastName"
              value={formData.lastName}
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
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormRow>

          <Input
            label="Sujet"
            name="subject"
            value={formData.subject}
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
            <Button type="submit">
              Envoyer le message
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
    </ContactContainer>
  );
};

export default Contact; 
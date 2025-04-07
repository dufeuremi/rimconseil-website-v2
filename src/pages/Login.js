import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';
import logoSrc from '../assets/images/logo.svg';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem 2rem 2rem 2rem;
  background-color: var(--color-background);
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
`;

const Logo = styled.img`
  height: 30px;
  margin-bottom: 2rem;
  
  &.error {
    display: none;
  }
`;

const LogoFallback = styled.div`
  display: none;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 2rem;
  
  &.visible {
    display: block;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SubmitButton = styled(Button)`
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifiant: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation basique
    if (!formData.identifiant || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Simulation d'authentification
    const validIdentifiant = 'admin';
    const validPassword = 'admin123';

    if (formData.identifiant === validIdentifiant && formData.password === validPassword) {
      navigate('/dashboard');
    } else {
      setError('Identifiant ou mot de passe incorrect');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo 
          src={logoSrc} 
          alt="rim'conseil logo" 
          className={imageError ? 'error' : ''}
          onError={handleImageError}
        />
        <LogoFallback className={imageError ? 'visible' : ''}>
          rim'conseil
        </LogoFallback>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            label="Identifiant"
            type="text"
            name="identifiant"
            value={formData.identifiant}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <SubmitButton 
            type="submit" 
            fullWidth
          >
            Se connecter
          </SubmitButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 
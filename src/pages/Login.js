import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import logoSrc from '../assets/images/logo.svg';
import { API_BASE_URL } from '../App';

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
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: rgba(229, 62, 62, 0.1);
  border-radius: 4px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #38a169;
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: rgba(56, 161, 105, 0.1);
  border-radius: 4px;
  text-align: center;
`;

// Fonction pour décoder un token JWT (sans vérification de signature)
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    console.error('Erreur lors du décodage du token:', e);
    return null;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Vérifier si le token est valide
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          
          await axios.get(`${API_BASE_URL}/api/user/me`, config);
          
          // Si le token est valide, rediriger vers le dashboard
          // Ou vers la page précédente si l'utilisateur était redirigé vers la connexion
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        } catch (error) {
          // Si le token est invalide, le supprimer
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    };
    
    checkAuth();
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      
      // Appel à l'API pour l'authentification
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email: formData.email,
        password: formData.password
      });
      
      // Récupération du token
      const { token } = response.data;
      
      if (token) {
        // Stockage du token dans localStorage
        localStorage.setItem('token', token);
        
        // Configuration d'Axios pour inclure le token dans les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Décodage du token pour l'afficher
        const decodedToken = decodeToken(token);
        
        setSuccess(`Connecté avec succès en tant que ${decodedToken?.email || 'utilisateur'}`);
        
        // Redirection vers le dashboard ou la page d'origine après un court délai
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }, 1500);
      } else {
        setError('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('Erreur d\'authentification:', err);
      setError(err.response?.data?.message || 'Identifiants incorrects ou serveur indisponible');
    } finally {
      setLoading(false);
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
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
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
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </SubmitButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 
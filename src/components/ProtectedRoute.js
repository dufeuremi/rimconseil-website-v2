import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../App';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Configuration du header avec le token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Vérification du token auprès de l'API
        await axios.get(`${API_BASE_URL}/api/user/me`, config);
        
        // Si on arrive ici, c'est que le token est valide
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        // Suppression du token invalide
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    // Afficher un indicateur de chargement pendant la vérification du token
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Vérification de l'authentification...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  // Rendre le contenu protégé si l'utilisateur est authentifié
  return children;
};

export default ProtectedRoute; 
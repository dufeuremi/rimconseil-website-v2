import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Title from '../../components/Title';
import Article from '../../components/Article';
import Button from '../../components/Button';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import SuccessPopup from '../../components/SuccessPopup';
import { RiAddLine } from 'react-icons/ri';
import axios from 'axios';
import { API_BASE_URL } from '../../App';
import { useNavigate } from 'react-router-dom';

const ArticlesContainer = styled.div`
  padding: 0;
  display: grid;
  gap: 1.25rem;
  transition: all 0.3s ease;
`;

// Style pour les catégories (repris du composant Page)
const CategoryTag = styled.span`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text);
  border: 1px solid var(--color-quaternary);
  
  &:first-child {
    background-color: var(--color-quaternary);
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

// Animation du skeleton loader
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonArticle = styled.div`
  background: #f6f7f8;
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
  padding: 1.5rem;
  height: 160px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
    transform: skewX(-20deg);
    animation: ${shimmer} 1.5s infinite;
  }
`;

const SkeletonTitle = styled.div`
  height: 20px;
  width: 60%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SkeletonDate = styled.div`
  height: 14px;
  width: 30%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const SkeletonText = styled.div`
  height: 14px;
  width: 90%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  margin-bottom: 0.75rem;
  
  &:last-child {
    width: 70%;
  }
`;

const SkeletonContainer = styled.div`
  display: grid;
  gap: 1.25rem;
  padding: 0;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-radius: 6px;
`;

const ArticleCount = styled.div`
  font-size: 0.9rem;
  color: var(--color-tertiary);
  
  span {
    font-weight: 600;
    color: var(--color-secondary);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-tertiary);
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 1rem;
  animation: pulse 1.5s infinite ease-in-out;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--color-error, #d32f2f);
  background-color: var(--color-error-light, #fff8f8);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid var(--color-error, #d32f2f);
`;

const ErrorDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: left;
  white-space: pre-wrap;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-tertiary);
  background-color: var(--color-light-gray, #f8f8f8);
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    color: var(--color-secondary);
  }
`;

const DashboardActualites = () => {
  const [actus, setActus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');
  const [refreshData, setRefreshData] = useState(0);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchActus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/actus`);
        console.log('Données API complètes:', response);
        console.log('Données API actus:', response.data);
        
        // Afficher le premier actus pour déboguer (s'il existe)
        if (response.data && response.data.length > 0) {
          console.log('Premier actus:', response.data[0]);
          // Liste toutes les propriétés du premier actus
          console.log('Propriétés du premier actus:', Object.keys(response.data[0]));
        }
        
        setActus(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des actus:', err);
        
        // Capturer les détails de l'erreur pour le débogage
        const errorMessage = err.message || 'Une erreur inconnue est survenue';
        const statusCode = err.response?.status || 'Pas de code d\'état';
        const errorData = err.response?.data || {};
        
        const detailsMessage = `
Message: ${errorMessage}
Code d\'état: ${statusCode}
URL: ${API_BASE_URL}/api/actus
Détails: ${JSON.stringify(errorData, null, 2)}
        `;
        
        setError('Impossible de charger les actus. Veuillez réessayer plus tard.');
        setErrorDetails(detailsMessage);
        setActus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActus();
  }, [refreshData]);

  const handleDeleteActus = async (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      await axios.delete(`${API_BASE_URL}/api/actus/${deleteId}`);
      // Rafraîchir la liste après suppression
      setRefreshData(prev => prev + 1);
      setSuccessMessage('Actualité supprimée avec succès');
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'actus:', err);
      setErrorDialogMessage('Impossible de supprimer l\'actus. Veuillez réessayer.');
      setShowErrorDialog(true);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleAddNewActus = async () => {
    console.log('Création d\'une nouvelle actualité');
    try {
      // Préparer les données minimales pour une nouvelle actu vide
      const newActuData = {
        titre: "Nouvelle actualité",
        date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        text_preview: "Aperçu de la nouvelle actualité",
        content_json: JSON.stringify({
          metadata: {
            type: "actus",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          blocks: {
            title_1: {
              type: "Titre",
              content: "Nouvelle actualité",
              order: 0
            }
          }
        })
      };
      
      // Créer la nouvelle actu via l'API
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/actus`, newActuData);
      console.log('Nouvelle actualité créée:', response.data);
      
      // Récupérer l'ID de la nouvelle actu
      const newActuId = response.data.id;
      
      // Rediriger vers la page d'édition de cette nouvelle actu
      navigate(`/dashboard/actualites/edit/${newActuId}`);
    } catch (err) {
      console.error('Erreur lors de la création de l\'actualité:', err);
      setErrorDialogMessage('Impossible de créer la nouvelle actualité. Veuillez réessayer.');
      setShowErrorDialog(true);
      setLoading(false);
    } finally {
      // Ensure loading is reset if navigation doesn't happen
      if (window.location.pathname.indexOf('/dashboard/actualites/edit/') === -1) {
        setLoading(false);
      }
    }
  };

  // Function to handle navigation to the edit page
  const handleEditActus = (id) => {
    console.log(`Navigating to edit page for actus ID: ${id}`);
    // Make sure we're trying to navigate to the right URL
    const url = `/dashboard/actualites/edit/${id}`;
    console.log(`Navigation URL: ${url}`);
    // Check if navigate function exists
    if (typeof navigate === 'function') {
      console.log('Navigate function exists, attempting navigation');
      navigate(url);
    } else {
      console.error('Navigation function is not available!');
    }
  };

  // Fonction pour générer plusieurs skeleton loaders
  const renderSkeletons = () => {
    return (
      <SkeletonContainer>
        {[...Array(3)].map((_, index) => (
          <SkeletonArticle key={index}>
            <SkeletonTitle />
            <SkeletonDate />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
          </SkeletonArticle>
        ))}
      </SkeletonContainer>
    );
  };

  return (
    <>
      <Title>Gestion des Actualités</Title>
      
      {/* Success Popup */}
      <SuccessPopup 
        show={showSuccessPopup} 
        message={successMessage} 
        onHide={() => setShowSuccessPopup(false)}
        duration={2000} // 2 seconds (1 second longer)
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirmation de suppression"
        confirmText="Supprimer définitivement"
        danger={true}
        isLoading={isDeleting}
      >
        <p>Êtes-vous sûr de vouloir supprimer cette actualité ?</p>
        <p style={{ fontWeight: 'bold', color: '#d32f2f' }}>Cette action est irréversible.</p>
      </ConfirmationDialog>
      
      {/* Error Dialog */}
      <ConfirmationDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        onConfirm={() => setShowErrorDialog(false)}
        title="Erreur"
        confirmText="OK"
        cancelText={null}
      >
        <p>{errorDialogMessage}</p>
      </ConfirmationDialog>
      
      {error && (
        <ErrorMessage>
          {error}
          <details>
            <summary style={{ cursor: 'pointer', marginTop: '8px' }}>Détails techniques</summary>
            <ErrorDetails>{errorDetails}</ErrorDetails>
          </details>
        </ErrorMessage>
      )}
      
      <ActionBar>
        <ArticleCount>
          <span>{actus.length}</span> actu(s)
        </ArticleCount>
        <Button 
          onClick={handleAddNewActus}
          arrow={true}
          variant="secondary"
        >
          Ajouter une actu
        </Button>
      </ActionBar>

      {loading ? (
        renderSkeletons()
      ) : actus.length === 0 ? (
        <EmptyMessage>
          <strong>Aucune actus trouvée</strong>
          Créez votre premier actus en cliquant sur le bouton "Ajouter un actus".
        </EmptyMessage>
      ) : (
        <ArticlesContainer>
          {actus.map(actusItem => {
            // Utiliser le champ category (array) si présent
            let categories = Array.isArray(actusItem.category) ? actusItem.category : [];
            return (
              <Article
                key={actusItem.id}
                id={actusItem.id}
                title={actusItem.titre || actusItem.title || 'Sans titre'}
                date={actusItem.date || 'Date inconnue'}
                description={actusItem.text_preview || actusItem.description || actusItem.content || 'Aucune description'}
                categories={categories}
                onDelete={handleDeleteActus}
                onEdit={handleEditActus}
              />
            );
          })}
        </ArticlesContainer>
      )}
    </>
  );
};

export default DashboardActualites; 
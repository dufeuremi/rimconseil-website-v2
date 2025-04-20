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

const DashboardArticles = () => {
  const [articles, setArticles] = useState([]);
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
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/articles`);
        console.log('Données API complètes:', response);
        console.log('Données API articles:', response.data);
        
        // Afficher le premier article pour déboguer (s'il existe)
        if (response.data && response.data.length > 0) {
          console.log('Premier article:', response.data[0]);
          // Liste toutes les propriétés du premier article
          console.log('Propriétés du premier article:', Object.keys(response.data[0]));
        }
        
        setArticles(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des articles:', err);
        
        // Capturer les détails de l'erreur pour le débogage
        const errorMessage = err.message || 'Une erreur inconnue est survenue';
        const statusCode = err.response?.status || 'Pas de code d\'état';
        const errorData = err.response?.data || {};
        
        const detailsMessage = `
Message: ${errorMessage}
Code d'état: ${statusCode}
URL: ${API_BASE_URL}/api/articles
Détails: ${JSON.stringify(errorData, null, 2)}
        `;
        
        setError('Impossible de charger les articles. Veuillez réessayer plus tard.');
        setErrorDetails(detailsMessage);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [refreshData]);

  const handleDeleteArticle = async (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      await axios.delete(`${API_BASE_URL}/api/articles/${deleteId}`);
      // Rafraîchir la liste après suppression
      setRefreshData(prev => prev + 1);
      setSuccessMessage('Article supprimé avec succès');
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'article:', err);
      setErrorDialogMessage('Impossible de supprimer l\'article. Veuillez réessayer.');
      setShowErrorDialog(true);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleAddNewArticle = async () => {
    console.log('Création d\'un nouvel article');
    try {
      // Préparer les données selon la documentation API
      const newArticleData = {
        date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        titre: "Nouvel article",
        text_preview: "Aperçu du nouvel article",
        content_json: {
          metadata: {
            type: "articles",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          blocks: {
            title_1: {
              type: "Titre",
              content: "Nouvel article",
              order: 0
            }
          }
        },
        path: "nouvel-article-" + Math.floor(Math.random() * 1000) // Optionnel selon la doc API
      };
      
      console.log('Données à envoyer:', newArticleData);
      
      // Créer le nouvel article via l'API
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/articles`, newArticleData, {
        headers: {
          'Content-Type': 'application/json',
          // L'Authorization token est déjà géré globalement par Axios
        }
      });
      console.log('Nouvel article créé:', response.data);
      
      // Afficher un message de succès
      setSuccessMessage('Article créé avec succès');
      setShowSuccessPopup(true);
      
      // Récupérer l'ID du nouvel article
      const newArticleId = response.data.id;
      
      // Rediriger vers la page d'édition de ce nouvel article
      navigate(`/dashboard/articles/edit/${newArticleId}`);
    } catch (err) {
      console.error('Erreur lors de la création de l\'article:', err);
      
      // Déterminer le message d'erreur en fonction du code d'erreur (selon la doc API)
      let errorMsg = 'Impossible de créer le nouvel article.';
      if (err.response) {
        if (err.response.status === 400) {
          errorMsg = 'Données invalides: certains champs obligatoires sont manquants.';
        } else if (err.response.status === 401) {
          errorMsg = 'Non authentifié. Veuillez vous reconnecter.';
        }
      }
      
      setErrorDialogMessage(errorMsg);
      setShowErrorDialog(true);
      setLoading(false);
    } finally {
      // Ensure loading is reset if navigation doesn't happen
      if (window.location.pathname.indexOf('/dashboard/articles/edit/') === -1) {
        setLoading(false);
      }
    }
  };

  // Function to handle navigation to the edit page
  const handleEditArticle = (id) => {
    console.log(`Navigating to edit page for article ID: ${id}`);
    // Make sure we're trying to navigate to the right URL
    const url = `/dashboard/articles/edit/${id}`;
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
      <Title>Gestion des Articles</Title>
      
      {/* Success Popup */}
      <SuccessPopup 
        show={showSuccessPopup} 
        message={successMessage} 
        onHide={() => setShowSuccessPopup(false)}
        duration={2000} // 2 seconds
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
        <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
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
          <span>{articles.length}</span> article(s)
        </ArticleCount>
        <Button 
          onClick={handleAddNewArticle}
          arrow={true}
          variant="secondary"
        >
          Ajouter un article
        </Button>
      </ActionBar>

      {loading ? (
        renderSkeletons()
      ) : articles.length === 0 ? (
        <EmptyMessage>
          <strong>Aucun article trouvé</strong>
          Créez votre premier article en cliquant sur le bouton "Ajouter un article".
        </EmptyMessage>
      ) : (
        <ArticlesContainer>
          {articles.map(article => {
            console.log('Rendu de l\'article:', article);
            
            // Utiliser le champ category (array) si présent
            let categories = Array.isArray(article.category) ? article.category : [];
            
            // Si aucune catégorie n'est présente, ajouter des exemples pour visualisation
            if (categories.length === 0) {
              // Différentes catégories selon ID pour varier l'affichage
              if (article.id % 3 === 0) {
                categories = ['Expertise', 'Conseil'];
              } else if (article.id % 3 === 1) {
                categories = ['Technologie', 'Innovation'];
              } else {
                categories = ['Stratégie', 'Management', 'Digital'];
              }
            }
            
            // Utiliser titre si disponible, puis title comme fallback
            const displayTitle = article.titre || article.title || 'Sans titre';
            
            return (
              <Article
                key={article.id}
                id={article.id}
                title={displayTitle}
                path={article.path || ''}
                date={article.date || 'Date inconnue'}
                description={article.text_preview || article.description || article.content || 'Aucune description'}
                categories={categories}
                route={article.route || article.id}
                onDelete={handleDeleteArticle}
                onEdit={handleEditArticle}
              />
            );
          })}
        </ArticlesContainer>
      )}
    </>
  );
};

export default DashboardArticles; 
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Title from '../components/Title';
import Article from '../components/Article';
import ArticleRenderer from '../components/ArticleRenderer';
import CoverImageDisplay from '../components/CoverImageDisplay';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

// Wrapper pour assurer la hauteur minimale
const PageWrapper = styled.div`
  min-height: calc(100vh - 150px - 50px); /* Ajuster selon la hauteur du header et footer */
  padding-top: ${props => props.isHomePage ? '0' : '10rem'}; /* Pas de padding top sur la page d'accueil */
  width: 100%;
  max-width: ${props => props.isHomePage ? '100%' : '1200px'};
  margin: 0 auto;
`;

const ArticlesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
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
  border-radius: 0;
  padding: 1.5rem;
  height: 160px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-tertiary);
  margin: 2rem 0;
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
  border-left: 4px solid var(--color-error, #d32f2f);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-tertiary);
  margin: 2rem 0;
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    color: var(--color-secondary);
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--color-primary);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const JsonContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  line-height: 1.5;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem; /* Ajout de marge en haut */
  margin-bottom: 3rem; /* Marge en bas augmentée drastiquement */
  padding-bottom: 1rem; /* Ajoute un peu d'espace sous le titre avant la bordure */
  border-bottom: 1px solid var(--color-quaternary); /* Ajoute une ligne de séparation */
`;

const DetailTitle = styled.h2`
  margin: 0;
  color: var(--color-secondary);
`;

const DetailDate = styled.span`
  font-size: 0.85rem;
  color: var(--color-tertiary);
  background: var(--color-quaternary);
  padding: 4px 8px;
  border-radius: 0;
  font-style: italic;
  white-space: nowrap;
`;

const DetailContentContainer = styled.div`
  margin-top: 2rem;
`;

/** Ajout du style pour les tags de filtre de catégorie **/
const CategoryFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.5rem 0 2.5rem 0;
  justify-content: center;
`;
const CategoryFilterTag = styled.button`
  background: ${({ active }) => active ? 'var(--color-primary)' : 'var(--color-quaternary)'};
  color: ${({ active }) => active ? 'white' : 'var(--color-secondary)'};
  border: 1px solid var(--color-quaternary);
  border-radius: 12px;
  padding: 0.25rem 0.75rem;
  font-size: 1em;
  font-weight: ${({ active }) => active ? 700 : 400};
  cursor: pointer;
  transition: background 0.2s, color 0.2s, font-weight 0.2s;
  outline: none;
  /* Désactive le hover/focus qui change la couleur */
  &:hover, &:focus {
    background: ${({ active }) => active ? 'var(--color-primary)' : 'var(--color-quaternary)'};
    color: ${({ active }) => active ? 'white' : 'var(--color-secondary)'};
  }
`;

const Actualites = () => {
  const [actusData, setActusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActu, setSelectedActu] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const isHomePage = window.location.pathname === '/';

  // Fonction utilitaire pour déterminer le statut en ligne de manière cohérente
  const getOnlineStatus = (item) => {
    return Boolean(
      (item.is_online !== undefined && item.is_online !== null) 
        ? item.is_online === 1 
        : (item.isOnline !== undefined && item.isOnline !== null)
          ? item.isOnline
          : false
    );
  };
  
  useEffect(() => {
    const fetchActus = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les actualités
        const response = await axios.get(`${API_BASE_URL}/api/actus`);
        const actusData = response.data;
        
        // Filtrer pour n'afficher que les actualités en ligne en public
        const onlineActus = actusData.filter(actu => {
          // Si isOnline est défini, l'utiliser
          if (actu.isOnline !== undefined) {
            return actu.isOnline === true;
          }
          // Sinon utiliser is_online (0 = hors ligne, 1 = en ligne)
          if (actu.is_online !== undefined) {
            return actu.is_online === 1;
          }
          // Par défaut, considérer comme en ligne si aucun champ n'est défini
          return true;
        });
        setActusData(onlineActus);
        
        // Si un ID est spécifié dans l'URL, chercher l'actualité correspondante
        if (id) {
          const actu = onlineActus.find(a => a.id == id || a.route == id);
          if (actu) {
            setSelectedActu(actu);
          } else {
            setError(`Actualité avec l'identifiant "${id}" introuvable ou non publiée.`);
          }
        } else {
          setSelectedActu(null);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des actualités:', err);
        setError('Impossible de charger les actualités. Veuillez réessayer plus tard.');
        setActusData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActus();
  }, [id]); // Réexécuter lorsque l'ID dans l'URL change

  const handleActuClick = (id) => {
    const actu = actusData.find(a => a.id === id);
    if (actu) {
      // Naviguer vers la page de l'actualité avec son ID
      navigate(`/actualites/${actu.id}`);
    }
  };
  
  const handleBack = () => {
    // Retourner à la liste des actualités
    navigate('/actualites');
  };
  
  const handleToggleStatus = (id, isOnline) => {
    setActusData(prevActus =>
      prevActus.map(actu =>
        actu.id === id ? { ...actu, isOnline } : actu
      )
    );
  };
  
  // Format JSON prettily
  const formatJSON = (json) => {
    let contentJson;
    
    if (typeof json === 'string') {
      try {
        contentJson = JSON.parse(json);
      } catch (e) {
        return json;
      }
    } else {
      contentJson = json;
    }
    
    return JSON.stringify(contentJson, null, 2);
  };
  
  // Format the date in French
  const formatDateInFrench = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      // Options for formatting the date in French
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      };
      
      return date.toLocaleDateString('fr-FR', options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  // Render skeletons during loading
  const renderSkeletons = () => {
    return (
      <SkeletonContainer>
        {[...Array(3)].map((_, index) => (
          <SkeletonArticle key={index} />
        ))}
      </SkeletonContainer>
    );
  };

  // Récupérer toutes les catégories uniques (array de string)
  const allCategories = Array.from(new Set(
    actusData.flatMap(a => Array.isArray(a.category) ? a.category : []).filter(Boolean)
  ));

  // Filtrer les actus selon les catégories sélectionnées
  const filteredActus = selectedCategories.length > 0
    ? actusData.filter(a => Array.isArray(a.category) && a.category.some(cat => selectedCategories.includes(cat)))
    : actusData;

  // Gestion du clic sur un tag
  const handleCategoryClick = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  if (loading) {
    return (
      <PageWrapper isHomePage={isHomePage}>
        <div className="container">
          {!isHomePage && <Title variant="page-title" level={2}>Actualités</Title>}
          <LoadingMessage>Chargement des actualités...</LoadingMessage>
          {renderSkeletons()}
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper isHomePage={isHomePage}>
        <div className="container">
          {!isHomePage && <Title variant="page-title" level={2}>Actualités</Title>}
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      </PageWrapper>
    );
  }

  // Display the detail view when an actu is selected
  if (selectedActu) {
    return (
      <PageWrapper isHomePage={isHomePage}>
        <div className="container">
          <BackButton onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Actualités
          </BackButton>
        </div>
        
        <div className="container">
          <DetailHeader>
            <DetailTitle>{selectedActu.titre || selectedActu.title}</DetailTitle>
            {selectedActu.date && (
              <DetailDate>{formatDateInFrench(selectedActu.date)}</DetailDate>
            )}
          </DetailHeader>
          
          {(() => {
            const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
            let imgSrc = '';
            if (selectedActu.cover_img_path && typeof selectedActu.cover_img_path === 'string' && selectedActu.cover_img_path.startsWith('/uploads/')) {
              imgSrc = API_BASE + selectedActu.cover_img_path;
            } else if (selectedActu.img_path && typeof selectedActu.img_path === 'string' && selectedActu.img_path.startsWith('/uploads/')) {
              imgSrc = API_BASE + selectedActu.img_path;
            } else if (selectedActu.cover_img_path && typeof selectedActu.cover_img_path === 'string' && selectedActu.cover_img_path.startsWith('http')) {
              imgSrc = selectedActu.cover_img_path;
            } else if (selectedActu.img_path && typeof selectedActu.img_path === 'string' && selectedActu.img_path.startsWith('http')) {
              imgSrc = selectedActu.img_path;
            } else {
              imgSrc = '/images/placeholder.jpg';
            }
            return (
              <img
                src={imgSrc}
                alt={selectedActu.titre || selectedActu.title || ''}
                style={{
                  width: '100%',
                  height: 'auto',
                  marginBottom: '2rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onError={e => { e.target.src = '/images/placeholder.jpg'; }}
              />
            );
          })()}
          
          {selectedActu.text_preview && (
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
            </p>
          )}
          
          <DetailContentContainer>
            <ArticleRenderer contentJson={selectedActu.content_json} />
          </DetailContentContainer>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper isHomePage={isHomePage}>
      <div className="container">
        {!isHomePage && <Title variant="page-title" level={2}>Actualités</Title>}
        {allCategories.length > 0 && (
          <CategoryFilterContainer>
            {allCategories.map(cat => (
              <CategoryFilterTag
                key={cat}
                type="button"
                active={selectedCategories.includes(cat)}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </CategoryFilterTag>
            ))}
          </CategoryFilterContainer>
        )}
        {filteredActus.length === 0 ? (
          <EmptyMessage>
            <strong>Aucune actualité trouvée</strong>
          </EmptyMessage>
        ) : (
          <ArticlesContainer>
            {filteredActus.map(actu => {
              let categories = Array.isArray(actu.category) ? actu.category : [];
              return (
                <Article
                  key={actu.id}
                  id={actu.id}
                  title={actu.titre || actu.title || 'Sans titre'}
                  date={actu.date || 'Date inconnue'}
                  description={actu.text_preview || actu.description || actu.content || 'Aucune description'}
                  categories={categories}
                  route={actu.route || actu.id}
                  isOnline={getOnlineStatus(actu)}
                  contentType="actualites"
                  coverImage={actu.img_path || actu.cover_img_path || ''}
                />
              );
            })}
          </ArticlesContainer>
        )}
      </div>
    </PageWrapper>
  );
};

export default Actualites; 
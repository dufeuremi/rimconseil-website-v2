import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Title from '../components/Title';
import Article from '../components/Article';
import ArticleRenderer from '../components/ArticleRenderer';
import axios from 'axios';
import { API_BASE_URL } from '../App';

// Wrapper pour assurer la hauteur minimale
const PageWrapper = styled.div`
  min-height: calc(100vh - 150px - 50px); /* Ajuster selon la hauteur du header et footer */
  padding-top: 10rem; /* Ajouter un padding top de 10rem */
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
  border-radius: 4px;
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
  border-radius: 0;
  padding: 0.35em 1.1em;
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
  const [actus, setActus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActu, setSelectedActu] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]); // multi-sélection
  
  useEffect(() => {
    const fetchActus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/actus`);
        setActus(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des actualités:', err);
        setError('Impossible de charger les actualités. Veuillez réessayer plus tard.');
        setActus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActus();
  }, []);

  const handleActuClick = (id) => {
    const actu = actus.find(a => a.id === id);
    if (actu) {
      setSelectedActu(actu);
    }
  };
  
  const handleBack = () => {
    setSelectedActu(null);
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
    actus.flatMap(a => Array.isArray(a.category) ? a.category : []).filter(Boolean)
  ));

  // Filtrer les actus selon les catégories sélectionnées
  const filteredActus = selectedCategories.length > 0
    ? actus.filter(a => Array.isArray(a.category) && a.category.some(cat => selectedCategories.includes(cat)))
    : actus;

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
      <PageWrapper>
        <div className="container">
          <Title variant="page-title" level={2}>Actualités</Title>
          <LoadingMessage>Chargement des actualités...</LoadingMessage>
          {renderSkeletons()}
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="container">
          <Title variant="page-title" level={2}>Actualités</Title>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      </PageWrapper>
    );
  }

  // Display the detail view when an actu is selected
  if (selectedActu) {
    return (
      <PageWrapper>
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
    <PageWrapper>
      <div className="container">
        <Title variant="page-title" level={2}>Actualités</Title>
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
                  onEdit={(id) => setSelectedActu(actus.find(a => a.id === id))}
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
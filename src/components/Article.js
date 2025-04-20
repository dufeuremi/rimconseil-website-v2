import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Text from './Text';

const ArticleWrapper = styled.div`
  position: relative;
  cursor: pointer;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  background: none;
  box-shadow: none;
  transition: none;
  min-height: auto;
  border-bottom: 1px solid var(--color-quaternary);

  &:hover {
    transform: none;
    box-shadow: none;
    background-color: rgba(248, 248, 248, 0.5);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActionButtonsContainer = styled.div`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.75rem;
  z-index: 1;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.35rem;
  cursor: pointer;
  color: var(--color-tertiary);
  opacity: 0.6;
  transition: opacity 0.2s ease, color 0.2s ease, transform 0.2s ease;
  z-index: 1;
  
  &:hover {
    opacity: 1;
    color: var(--color-primary);
    transform: scale(1.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    color: #d32f2f;
  }
`;

const EditButton = styled(ActionButton)``;

const ImageContainer = styled.div`
  flex: 0 0 300px;
  height: 200px;
  background-color: #f0f0f0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: var(--color-secondary);
  margin: 0;
  font-weight: 500;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
`;

const TitleText = styled.span`
  flex: 1;
`;

const DateLabel = styled.span`
  font-size: 0.85rem;
  color: var(--color-tertiary);
  background: var(--color-quaternary);
  padding: 4px 8px;
  font-style: italic;
  white-space: nowrap;
  margin-left: 12px;
`;

const Path = styled.span`
  color: var(--color-tertiary);
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

const Description = styled.p`
  color: var(--color-text);
  margin-top: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: left;
`;

const Categories = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Category = styled.span`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text);
  border: 1px solid var(--color-quaternary);
  
  &:first-child {
    background-color: var(--color-quaternary);
  }
`;

const Article = ({ title, path, description, categories = [], id, onDelete, onEdit, date, route }) => {
  const navigate = useNavigate();

  // Format the date in French
  const formatDateInFrench = (dateString) => {
    if (!dateString || dateString === 'Date inconnue') return '';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;
      
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
  
  const frenchDate = formatDateInFrench(date);

  const handleClick = (e) => {
    // Empêche la navigation si on clique sur les boutons d'action
    if (e.target.closest('.article-action-button')) return;
    
    // If we have a route prop and we're not in dashboard (no onDelete)
    if (route && !onDelete) {
      navigate(`/articles/${route}`);
      return;
    }
    
    // Trigger edit on main click if onEdit is provided
    if (typeof onEdit === 'function') {
      onEdit(id);
    }
  };
  
  const handleEdit = (e) => {
    e.stopPropagation(); // Empêche le clic de se propager au wrapper
    // Use the passed onEdit function
    if (typeof onEdit === 'function') {
      onEdit(id);
    } else {
      // Fallback or error handling if onEdit is not provided
      console.warn("onEdit prop not provided to Article component for ID:", id);
      // navigate(`/dashboard/articles/${id}/edit`); // Example fallback
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Empêche le clic de se propager au wrapper
    onDelete(id);
  };

  // Si categories n'est pas un tableau, convertir ou initialiser
  const categoryArray = Array.isArray(categories) ? categories : 
                       (categories ? [categories] : []);

  return (
    <ArticleWrapper onClick={handleClick}>
      {/* N'afficher les boutons d'action que si onDelete est fourni */}
      {onDelete && (
        <ActionButtonsContainer>
          <EditButton 
            className="article-action-button edit-article-button" 
            onClick={handleEdit} 
            title="Modifier l'article"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </EditButton>
          <DeleteButton 
            className="article-action-button delete-article-button" 
            onClick={handleDelete} 
            title="Supprimer l'article"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </DeleteButton>
        </ActionButtonsContainer>
      )}
      
      {/* Affichage des catégories au-dessus du titre */}
      {categoryArray.length > 0 && (
        <Categories>
          {categoryArray.map((category, index) => (
            <Category key={index}>{category}</Category>
          ))}
        </Categories>
      )}

      <Title>
        <TitleText>
          {title}
          <Path>{path}</Path>
        </TitleText>
        {frenchDate && <DateLabel>{frenchDate}</DateLabel>}
      </Title>
      <Text variant="body-small">{description}</Text>
    </ArticleWrapper>
  );
};

export default Article; 
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Text from './Text';

const ArticleWrapper = styled.div`
  position: relative;
  padding: 1.5rem;
  background: white;
  margin-bottom: 1rem;
  border: 1px solid var(--color-quaternary);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--color-tertiary);
  opacity: 0.5;
  transition: opacity 0.2s ease, color 0.2s ease;
  z-index: 1;

  &:hover {
    opacity: 1;
    color: var(--color-primary);
  }
`;

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
`;

const Date = styled.span`
  color: var(--color-tertiary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Description = styled.p`
  color: var(--color-text);
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
`;

const Path = styled.span`
  color: var(--color-tertiary);
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

const Categories = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Category = styled.span`
  background-color: var(--color-quaternary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text);
`;

const Article = ({ title, path, description, categories = [], id, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Empêche la navigation si on clique sur le bouton supprimer
    if (e.target.closest('.delete-article-button')) return;
    navigate(`/dashboard/articles/${id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Empêche le clic de se propager au wrapper
    onDelete(id);
  };

  return (
    <ArticleWrapper onClick={handleClick}>
      <DeleteButton className="delete-article-button" onClick={handleDelete} title="Supprimer l'article">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </DeleteButton>
      <Categories>
        {categories.map((category, index) => (
          <Category key={index}>{category}</Category>
        ))}
      </Categories>
      <Title>
        {title}
        <Path>{path}</Path>
      </Title>
      <Text variant="body-small">{description}</Text>
    </ArticleWrapper>
  );
};

export default Article; 
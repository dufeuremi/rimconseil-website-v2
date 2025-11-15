import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../App';
import { getDisplayImage, processImageUrl, getImageWithFallback } from '../utils/imageUtils';
import Text from './Text';
import SuccessPopup from './SuccessPopup';



const ArticleWrapper = styled.div`
  position: relative;
  cursor: ${props => (props.route && props.isOnline) ? 'pointer' : 'default'};
  display: flex;
  flex-direction: row;
  border-radius: 0;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 160px;
  overflow: hidden;
  opacity: ${props => props.isOffline ? 0.6 : 1};

  &:hover {
    transform: ${props => (props.route && props.isOnline) ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => (props.route && props.isOnline) ? '0 4px 16px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
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

const ToggleSwitch = styled.div`
  position: relative;
  width: 40px;
  height: 20px;
  background-color: ${props => props.isOnline ? 'var(--color-primary)' : '#6c757d'};
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.isOnline ? '22px' : '2px'};
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ToggleLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  color: ${props => props.isOnline ? 'var(--color-primary)' : '#6c757d'};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const StatusContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
`;

const ImageContainer = styled.div`
  flex: 0 0 200px;
  min-height: 160px;
  height: 100%;
  background-color: #f8f9fa;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e9ecef;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 0;
    display: block;
  }
  
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 160px;
    background: url('/images/article-illustration.svg') no-repeat center center;
    background-size: 60px;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    position: relative;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    flex: 0 0 120px;
    min-height: 120px;
    height: 120px;
    
    .placeholder {
      min-height: 120px;
      background-size: 40px;
    }
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: var(--color-secondary);
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  text-align: left;
  line-height: 1.3;
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
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Categories = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const Category = styled.span`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text);
  border: 1px solid var(--color-quaternary);
  border-radius: 12px;
  
  &:first-child {
    background-color: var(--color-quaternary);
  }
`;

const Article = ({ 
  title, 
  path, 
  description, 
  categories = [],
  route,
  date,
  onEdit, 
  onDelete,
  onToggleStatus,
  id,
  isOnline = true,
  showStatusToggle = false,
  contentType = "articles",
  isDashboard = false,
  coverImage = ''
}) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Affichage public : priorité cover_img_path > img_path > placeholder, jamais base64
  let processedImageUrl = '';
  if (coverImage && typeof coverImage === 'string' && coverImage.startsWith('/uploads/')) {
    processedImageUrl = `${API_BASE_URL}${coverImage}`;
  } else if (coverImage && typeof coverImage === 'string' && coverImage.startsWith('http')) {
    processedImageUrl = coverImage;
  } else if (coverImage && typeof coverImage === 'string' && coverImage.startsWith('data:')) {
    processedImageUrl = '/images/placeholder.jpg';
  } else if (coverImage && typeof coverImage === 'string' && coverImage.length > 0) {
    processedImageUrl = coverImage;
  } else {
    processedImageUrl = '/images/placeholder.jpg';
  }



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

  const handleClick = () => {
    // Only allow navigation if the article is online
    if (route && isOnline) {
      // Navigate to the correct URL based on content type
      const baseUrl = contentType === 'actualites' ? '/actualites' : '/articles';
      navigate(`${baseUrl}/${route}`);
    }
  };

  const handleToggleStatus = (e) => {
    e.stopPropagation();
    const newStatus = !isOnline;
    const statusText = newStatus ? 'en ligne' : 'hors ligne';
    
    if (onToggleStatus) {
      onToggleStatus(id, newStatus);
    }
    
    setPopupMessage(`Document mis ${statusText} avec succès`);
    setShowPopup(true);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const frenchDate = formatDateInFrench(date);

  // Convert categories to array if it's a string
  const categoryArray = Array.isArray(categories) ? categories : 
                       (typeof categories === 'string' ? [categories] : []);

  // Determine if we should show action buttons (edit/delete)
  // In dashboard: always show edit button if onEdit is provided
  // In public pages: hide edit button if the article is online
  const showEditButton = onEdit && (isDashboard || !isOnline);
  const showDeleteButton = onDelete;

  return (
    <>
      <SuccessPopup
        message={popupMessage}
        show={showPopup}
        onHide={() => setShowPopup(false)}
        duration={2000}
      />
      
      <ArticleWrapper 
        onClick={handleClick} 
        isOffline={!isOnline}
        route={route}
        isOnline={isOnline}
      >
        <ImageContainer>
          <img
            src={processedImageUrl}
            /* alt removed to avoid blinking alt text */
            onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 0 }}
          />
        </ImageContainer>
        
        <ContentContainer>
          {showStatusToggle && (
            <StatusContainer>
              <ToggleSwitch isOnline={isOnline} onClick={handleToggleStatus}>
                <ToggleSlider isOnline={isOnline} />
              </ToggleSwitch>
              <ToggleLabel isOnline={isOnline}>
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </ToggleLabel>
            </StatusContainer>
          )}
          
          {(showEditButton || showDeleteButton) && (
            <ActionButtonsContainer>
              {showEditButton && (
                <EditButton onClick={handleEdit} title="Modifier">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </EditButton>
              )}
              {showDeleteButton && (
                <DeleteButton onClick={handleDelete} title="Supprimer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </DeleteButton>
              )}
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
          <Description>{description}</Description>
        </ContentContainer>
      </ArticleWrapper>
    </>
  );
};

export default Article; 
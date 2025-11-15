import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Title from './Title';
import Article from './Article';
import Button from './Button';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import { Link } from 'react-router-dom';

const SectionContainer = styled.section`
  width: 100%;
  max-width: 1664px;
  margin: 0 auto;
  padding: 4rem 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: var(--color-text-light);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const ActualitesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TileCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, transparent, #F4F9FF);
  border: none;
  border-radius: 0;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const TileImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  background-color: var(--color-quaternary);
`;

const TileContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const TileType = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: ${props => props.$type === 'article' ? 'rgba(44, 119, 227, 0.1)' : 'rgba(46, 139, 87, 0.1)'};
  color: ${props => props.$type === 'article' ? 'var(--color-primary)' : 'var(--color-green)'};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 0;
  align-self: flex-start;
  letter-spacing: 0.5px;
`;

const TileTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin: 0;
  line-height: 1.4;
`;

const TileCategory = styled.p`
  font-size: 0.875rem;
  color: var(--color-tertiary);
  margin: 0;
  font-style: italic;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-light);
  font-size: 1rem;
`;

const ActualitesSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Récupérer les actualités et les articles en parallèle
        const [actusResponse, articlesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/actus`),
          axios.get(`${API_BASE_URL}/api/articles`)
        ]);
        
        // Formatter les actualités
        const actus = actusResponse.data
          .filter(actu => getOnlineStatus(actu))
          .map(actu => ({
            id: actu.id,
            type: 'actualité',
            title: actu.titre || actu.title || 'Sans titre',
            date: actu.date || 'Date inconnue',
            category: Array.isArray(actu.category) ? actu.category.join(', ') : (actu.category || ''),
            route: `/actualites/${actu.route || actu.id}`,
            coverImage: actu.img_path || actu.cover_img_path || ''
          }));
        
        // Formatter les articles
        const articles = articlesResponse.data
          .filter(article => getOnlineStatus(article))
          .map(article => ({
            id: article.id,
            type: 'article',
            title: article.titre || article.title || 'Sans titre',
            date: article.date || 'Date inconnue',
            category: Array.isArray(article.category) ? article.category.join(', ') : (article.category || ''),
            route: `/articles/${article.route || article.id}`,
            coverImage: article.img_path || article.cover_img_path || ''
          }));
        
        // Mélanger et trier par date, prendre les 6 plus récents
        const allItems = [...actus, ...articles]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);
        
        setItems(allItems);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération du contenu:', err);
        setError('Impossible de charger le contenu.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <SectionContainer>
        <TitleContainer>
          <Title level={2} align="center" variant="section-title">
            Articles et Actualités
          </Title>
        </TitleContainer>
        <LoadingMessage>Chargement...</LoadingMessage>
      </SectionContainer>
    );
  }

  if (error || items.length === 0) {
    return null; // Ne pas afficher la section s'il y a une erreur ou pas de contenu
  }

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={2} align="center" variant="section-title">
          Articles et Actualités
        </Title>
      </TitleContainer>
      <SectionDescription>
        Découvrez nos derniers articles et actualités pour rester informé de nos analyses et évolutions.
      </SectionDescription>
      
      <ActualitesContainer>
        {items.map(item => (
          <TileCard key={`${item.type}-${item.id}`} to={item.route}>
            <TileImage $src={item.coverImage ? `${API_BASE_URL}${item.coverImage}` : ''} />
            <TileContent>
              <TileType $type={item.type}>{item.type}</TileType>
              <TileTitle>{item.title}</TileTitle>
              {item.category && <TileCategory>{item.category}</TileCategory>}
            </TileContent>
          </TileCard>
        ))}
      </ActualitesContainer>
      
      <ButtonContainer>
        <Button as={Link} to="/actualites" arrow={true}>
          Voir tout
        </Button>
      </ButtonContainer>
    </SectionContainer>
  );
};

export default ActualitesSection; 
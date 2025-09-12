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
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 3rem;
  
  > * {
    margin-bottom: 0.5rem;
  }
  
  > *:last-child {
    margin-bottom: 0;
  }
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
  const [actus, setActus] = useState([]);
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
    const fetchActus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/actus`);
        // Prendre seulement les 3 dernières actualités en ligne
        const recentActus = response.data
          .filter(actu => {
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
          }) // Afficher seulement les actualités en ligne
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Trier par date décroissante
          .slice(0, 3); // Prendre les 3 plus récentes
        setActus(recentActus);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des actualités:', err);
        setError('Impossible de charger les actualités.');
        setActus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActus();
  }, []);

  if (loading) {
    return (
      <SectionContainer>
        <TitleContainer>
          <Title level={2} align="center" variant="section-title">
            Nos dernières actualités
          </Title>
        </TitleContainer>
        <LoadingMessage>Chargement des actualités...</LoadingMessage>
      </SectionContainer>
    );
  }

  if (error || actus.length === 0) {
    return null; // Ne pas afficher la section s'il y a une erreur ou pas d'actualités
  }

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={2} align="center" variant="section-title">
          Nos dernières actualités
        </Title>
      </TitleContainer>
      <SectionDescription>
        Découvrez nos dernières actualités et restez informé de nos nouveautés et évolutions.
      </SectionDescription>
      
      <ActualitesContainer>
        {actus.map(actu => {
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
              coverImage={actu.cover_img_path || actu.img_path || ''}
            />
          );
        })}
      </ActualitesContainer>
      
      <ButtonContainer>
        <Button as={Link} to="/actualites" arrow={true}>
          Voir toutes les actualités
        </Button>
      </ButtonContainer>
    </SectionContainer>
  );
};

export default ActualitesSection; 
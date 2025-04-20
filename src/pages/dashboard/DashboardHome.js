import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  RiArticleLine, 
  RiAlertLine, 
  RiLinkM, 
  RiFileTextLine,
  RiMailLine
} from 'react-icons/ri';
import BugReportModal from '../../components/BugReportModal';
import Title from '../../components/Title';
import axios from 'axios';
import { API_BASE_URL } from '../../App';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const DashboardCard = styled.div`
  background-color: white;
  border-radius: 0;
  padding: var(--dashboard-padding-lg);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dashboard-border-color);
  box-shadow: none;
  
  &:hover {
    box-shadow: none;
    transform: none;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--dashboard-border-color);
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--dashboard-text-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;

  .icon {
    color: var(--dashboard-active-color);
    font-size: 1.5rem;
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dashboard-active-color);
  font-size: 1.25rem;
  text-decoration: none;
  transition: all 0.2s;
  height: 32px;
  width: 32px;
  border-radius: 4px;
  
  &:hover {
    background-color: var(--dashboard-hover-bg);
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
`;

const ListItemLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 0.75rem 0;
  border-radius: 0;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid var(--dashboard-border-color);
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
    border-color: var(--dashboard-active-color);
    box-shadow: none;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemTitle = styled.span`
  font-weight: 500;
  color: var(--dashboard-text-color);
  transition: color 0.2s;
  
  ${ListItemLink}:hover & {
    color: var(--dashboard-active-color);
  }
`;

const ItemDate = styled.span`
  font-size: 0.875rem;
  color: var(--dashboard-inactive-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .date-icon {
    color: var(--dashboard-inactive-color);
  }
`;

const StatsCard = styled.div`
  background: white;
  border: 1px solid var(--dashboard-border-color);
  padding: 1.5rem;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0;
  background-color: ${props => props.isButton ? 'var(--color-primary)' : 'var(--background-secondary)'};
  cursor: ${props => props.isButton ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.isButton ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isButton ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.isButton ? 'white' : 'var(--color-primary)'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.isButton ? 'white' : 'var(--color-tertiary)'};
  font-weight: ${props => props.isButton ? '500' : 'normal'};
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.isButton ? 'white' : 'var(--color-primary)'};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--dashboard-inactive-color);
  flex-grow: 1;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--dashboard-inactive-color);
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 0;
  flex-grow: 1;
  
  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
  border-radius: 0;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid var(--dashboard-border-color);
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${props => props.isProcessed ? 
      'var(--color-success, #4caf50)' : 
      'var(--color-warning, #ff9800)'};
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: none;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MessageTitle = styled.span`
  font-weight: 500;
  color: var(--dashboard-text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MessagePreview = styled.div`
  font-size: 0.875rem;
  color: var(--dashboard-inactive-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.4;
`;

const StatusIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.isProcessed ? 
    'var(--color-success, #4caf50)' : 
    'var(--color-warning, #ff9800)'};
  box-shadow: 0 0 4px ${props => props.isProcessed ? 
    'rgba(76, 175, 80, 0.5)' : 
    'rgba(255, 152, 0, 0.5)'};
`;

const Spinner = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--dashboard-active-color);
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.75rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const DashboardHome = () => {
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [actus, setActus] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState({
    articles: true,
    actus: true,
    messages: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesResponse = await axios.get(`${API_BASE_URL}/api/articles`);
        setArticles(articlesResponse.data.slice(0, 3)); // Get the 3 most recent
        setLoading(prev => ({ ...prev, articles: false }));
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(prev => ({ ...prev, articles: false }));
      }

      try {
        // Fetch actualités
        const actusResponse = await axios.get(`${API_BASE_URL}/api/actus`);
        setActus(actusResponse.data.slice(0, 3)); // Get the 3 most recent
        setLoading(prev => ({ ...prev, actus: false }));
      } catch (error) {
        console.error('Error fetching actualités:', error);
        setLoading(prev => ({ ...prev, actus: false }));
      }

      try {
        // Fetch messages
        const messagesResponse = await axios.get(`${API_BASE_URL}/api/messages`);
        setMessages(messagesResponse.data.slice(0, 3)); // Get the 3 most recent
        setLoading(prev => ({ ...prev, messages: false }));
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  return (
    <>
      <Title level={1} align="center" variant="page-title">
        Dashboard
      </Title>
      
      <StatsCard>
        <StatsGrid>
          <StatItem>
            <StatIcon>
              <RiArticleLine />
            </StatIcon>
            <StatValue>{articles.length}</StatValue>
            <StatLabel>Articles</StatLabel>
          </StatItem>
          
          <StatItem>
            <StatIcon>
              <RiFileTextLine />
            </StatIcon>
            <StatValue>{actus.length}</StatValue>
            <StatLabel>Actualités</StatLabel>
          </StatItem>
          
          <StatItem>
            <StatIcon>
              <RiMailLine />
            </StatIcon>
            <StatValue>{messages.length}</StatValue>
            <StatLabel>Messages</StatLabel>
          </StatItem>
          
          <StatItem isButton onClick={() => setIsBugModalOpen(true)}>
            <StatIcon isButton>
              <RiAlertLine />
            </StatIcon>
            <StatLabel isButton>Signaler une panne</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsCard>

      <DashboardGrid>
        <DashboardCard>
          <CardHeader>
            <CardTitle>
              <RiArticleLine className="icon" />
              Articles récents
            </CardTitle>
            <ViewAllLink to="/dashboard/articles" title="Voir tous les articles">
              <RiLinkM />
            </ViewAllLink>
          </CardHeader>
          
          {loading.articles ? (
            <LoadingState>
              <Spinner />
              Chargement des articles...
            </LoadingState>
          ) : articles.length === 0 ? (
            <EmptyState>
              <RiArticleLine className="empty-icon" />
              <p>Aucun article disponible</p>
              <p>Cliquez sur "Voir tous les articles" pour en créer un</p>
            </EmptyState>
          ) : (
            <ItemsList>
              {articles.map((article, index) => (
                <ListItemLink key={index} to={`/dashboard/articles/edit/${article.id}`}>
                  <ItemTitle>{article.titre || article.title || 'Sans titre'}</ItemTitle>
                  <ItemDate>
                    {formatDate(article.date)}
                  </ItemDate>
                </ListItemLink>
              ))}
            </ItemsList>
          )}
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardTitle>
              <RiFileTextLine className="icon" />
              Actualités récentes
            </CardTitle>
            <ViewAllLink to="/dashboard/actualites" title="Voir toutes les actualités">
              <RiLinkM />
            </ViewAllLink>
          </CardHeader>
          
          {loading.actus ? (
            <LoadingState>
              <Spinner />
              Chargement des actualités...
            </LoadingState>
          ) : actus.length === 0 ? (
            <EmptyState>
              <RiFileTextLine className="empty-icon" />
              <p>Aucune actualité disponible</p>
              <p>Cliquez sur "Voir toutes les actualités" pour en créer une</p>
            </EmptyState>
          ) : (
            <ItemsList>
              {actus.map((actu, index) => (
                <ListItemLink key={index} to={`/dashboard/actualites/edit/${actu.id}`}>
                  <ItemTitle>{actu.titre || actu.title || 'Sans titre'}</ItemTitle>
                  <ItemDate>
                    {formatDate(actu.date)}
                  </ItemDate>
                </ListItemLink>
              ))}
            </ItemsList>
          )}
        </DashboardCard>

        <DashboardCard>
          <CardHeader>
            <CardTitle>
              <RiMailLine className="icon" />
              Messages récents
            </CardTitle>
            <ViewAllLink to="/dashboard/messages" title="Voir tous les messages">
              <RiLinkM />
            </ViewAllLink>
          </CardHeader>
          
          {loading.messages ? (
            <LoadingState>
              <Spinner />
              Chargement des messages...
            </LoadingState>
          ) : messages.length === 0 ? (
            <EmptyState>
              <RiMailLine className="empty-icon" />
              <p>Aucun message reçu</p>
              <p>Les nouveaux messages apparaîtront ici</p>
            </EmptyState>
          ) : (
            <ItemsList>
              {messages.map((message, index) => (
                <MessageItem key={index} isProcessed={message.status === 1}>
                  <MessageHeader>
                    <MessageTitle>
                      <StatusIndicator isProcessed={message.status === 1} />
                      {message.prenom} {message.nom}
                    </MessageTitle>
                    <ItemDate>
                      {formatDate(message.date)}
                    </ItemDate>
                  </MessageHeader>
                  <MessagePreview>
                    {message.sujet || 'Sans sujet'} - {message.message.substring(0, 50)}...
                  </MessagePreview>
                </MessageItem>
              ))}
            </ItemsList>
          )}
        </DashboardCard>
      </DashboardGrid>

      <BugReportModal 
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
      />
    </>
  );
};

export default DashboardHome; 
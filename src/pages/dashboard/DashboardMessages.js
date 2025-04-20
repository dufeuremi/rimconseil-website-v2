import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Title from '../../components/Title';
import Button from '../../components/Button';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import SuccessPopup from '../../components/SuccessPopup';
import axios from 'axios';
import { API_BASE_URL } from '../../App';
import { CaretDown, CaretRight, Check, Circle } from '@phosphor-icons/react';

// Animation du skeleton loader
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const expandAnimation = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
`;

const SkeletonRow = styled.div`
  background: #f6f7f8;
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
  height: 50px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
  
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

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
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

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-radius: 6px;
`;

const MessageCount = styled.div`
  font-size: 0.9rem;
  color: var(--color-tertiary);
  
  span {
    font-weight: 600;
    color: var(--color-secondary);
  }
`;

const MessagesTable = styled.div`
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-radius: 0;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 0.8fr) minmax(80px, 0.5fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(150px, 1.2fr) minmax(60px, 0.3fr);
  text-align: left;
  padding: 12px 15px;
  background-color: var(--background-secondary);
  color: var(--color-secondary);
  font-weight: 500;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    grid-template-columns: minmax(80px, 0.8fr) minmax(120px, 1fr) minmax(80px, 0.7fr) minmax(60px, 0.3fr);
  }
`;

const MessageRow = styled.div`
  border-bottom: 1px solid var(--color-quaternary);
  transition: background-color 0.2s ease;
  
  &:nth-child(even) {
    background-color: var(--background-secondary);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const MessageHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 0.8fr) minmax(80px, 0.5fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(150px, 1.2fr) minmax(60px, 0.3fr);
  padding: 15px;
  cursor: pointer;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: minmax(80px, 0.8fr) minmax(120px, 1fr) minmax(80px, 0.7fr) minmax(60px, 0.3fr);
  }
`;

const MessageContent = styled.div`
  padding: 0 15px 20px 150px;
  overflow: hidden;
  animation: ${expandAnimation} 0.3s ease-out forwards;
  border-top: 1px solid #f0f0f0;

  ${props => props.isOpen ? css`
    animation: ${expandAnimation} 0.3s ease-out forwards;
  ` : css`
    display: none;
  `}
`;

const MessageField = styled.div`
  margin-bottom: 12px;
  padding-top: 12px;
  
  h4 {
    margin: 0 0 8px 0;
    color: var(--color-tertiary);
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  p {
    margin: 0;
    color: var(--color-secondary);
    line-height: 1.6;
  }
`;

const StatusToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.processed ? 'var(--color-success, #388e3c)' : 'var(--color-warning, #f57c00)'};
  transition: color 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background-color: ${props => props.processed ? 'var(--color-success, #388e3c)' : 'var(--color-warning, #f57c00)'};
`;

const TableHeaderItem = styled.div`
  &:nth-child(1) { text-align: left; }
  &:nth-child(7) { text-align: center; }
`;

const MessageCell = styled.div`
  &:nth-child(1) { text-align: left; }
  &:nth-child(7) { text-align: center; }
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Styles pour les éléments formatés
const StyledSpan = styled.span`
  &.bold {
    font-weight: 700;
    color: var(--color-primary, #2563eb);
  }
  
  &.italic {
    font-style: italic;
    color: var(--color-secondary, #4b5563);
  }
  
  &.highlight {
    background-color: #fef3c7;
    padding: 0 2px;
    border-radius: 2px;
  }
  
  &.quote {
    display: block;
    border-left: 3px solid var(--color-tertiary, #6b7280);
    padding-left: 10px;
    margin: 8px 0;
    color: var(--color-tertiary, #6b7280);
    font-style: italic;
  }
  
  &.link {
    color: var(--color-primary, #2563eb);
    text-decoration: underline;
    cursor: pointer;
  }
`;

const DashboardMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshData, setRefreshData] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const messageRefs = useRef({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/messages`);
        setMessages(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des messages:', err);
        setError('Impossible de charger les messages. Veuillez réessayer plus tard.');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [refreshData]);

  // Effet pour appliquer des styles visuels aux messages après le rendu
  useEffect(() => {
    if (!messages.length) return;
    
    // Parcourir tous les messages dont le contenu est affiché
    Object.keys(expandedMessages).forEach(messageId => {
      if (!expandedMessages[messageId] || !messageRefs.current[messageId]) return;
      
      const messageElement = messageRefs.current[messageId];
      if (!messageElement) return;
      
      try {
        // Appliquer des styles visuels
        applyVisualStyles(messageElement);
      } catch (err) {
        console.error('Erreur lors de l\'application des styles visuels:', err);
      }
    });
  }, [expandedMessages, messages]);
  
  // Fonction pour appliquer des styles visuels
  const applyVisualStyles = (element) => {
    // Récupérer le contenu textuel
    const text = element.textContent;
    let html = text;
    
    // Remplacer les patterns par des spans stylisés
    // 1. Texte en gras: *texte*
    html = html.replace(/\*(.*?)\*/g, '<span class="styled-text bold">$1</span>');
    
    // 2. Texte en italique: _texte_
    html = html.replace(/_(.*?)_/g, '<span class="styled-text italic">$1</span>');
    
    // 3. Texte surligné: ==texte==
    html = html.replace(/==(.*?)==/g, '<span class="styled-text highlight">$1</span>');
    
    // 4. Citations: > texte
    html = html.replace(/^>(.*?)$/gm, '<span class="styled-text quote">$1</span>');
    
    // 5. Liens: [texte](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<span class="styled-text link" data-url="$2">$1</span>');
    
    // Appliquer le HTML formaté
    element.innerHTML = html;
    
    // Ajouter des écouteurs d'événements pour les liens
    element.querySelectorAll('.styled-text.link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
    });
  };

  const toggleMessageExpand = (id) => {
    setExpandedMessages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleMessageStatus = async (message, e) => {
    e.stopPropagation(); // Éviter que le toggle de l'expansion se déclenche
    
    try {
      const newStatus = message.status === 1 ? 0 : 1;
      await axios.patch(`${API_BASE_URL}/api/messages/${message.id}`, { status: newStatus });
      
      // Mettre à jour localement
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, status: newStatus } : m)
      );
      
      setSuccessMessage(`Message marqué comme ${newStatus === 1 ? 'traité' : 'non traité'}`);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err);
      setError('Impossible de modifier le statut du message.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Heure inconnue';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSkeletons = () => {
    return (
      <SkeletonContainer>
        {[...Array(5)].map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </SkeletonContainer>
    );
  };

  return (
    <>
      <Title variant="dashboard-title">Messages</Title>
      
      {loading ? (
        <>
          <LoadingMessage>Chargement des messages...</LoadingMessage>
          {renderSkeletons()}
        </>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <ActionBar>
            <MessageCount>
              <span>{messages.length}</span> message(s)          </MessageCount>
          </ActionBar>
          
          {messages.length === 0 ? (
            <EmptyMessage>
              <strong>Aucun message trouvé</strong>
              Les messages des visiteurs apparaîtront ici.
            </EmptyMessage>
          ) : (
            <MessagesTable>
              <TableHeader>
                <TableHeaderItem>Date</TableHeaderItem>
                <TableHeaderItem>Heure</TableHeaderItem>
                <TableHeaderItem>Prénom</TableHeaderItem>
                <TableHeaderItem>Nom</TableHeaderItem>
                <TableHeaderItem>Téléphone</TableHeaderItem>
                <TableHeaderItem>Email</TableHeaderItem>
                <TableHeaderItem>Détails</TableHeaderItem>
              </TableHeader>
              
              {messages.map(message => (
                <MessageRow key={message.id}>
                  <MessageHeader onClick={() => toggleMessageExpand(message.id)}>
                    <MessageCell>{formatDate(message.date)}</MessageCell>
                    <MessageCell>{formatTime(message.date)}</MessageCell>
                    <MessageCell>{message.prenom}</MessageCell>
                    <MessageCell>{message.nom}</MessageCell>
                    <MessageCell>{message.telephone || '-'}</MessageCell>
                    <MessageCell>{message.email}</MessageCell>
                    <MessageCell>
                      <ExpandIcon>
                        {expandedMessages[message.id] ? <CaretDown size={20} /> : <CaretRight size={20} />}
                      </ExpandIcon>
                    </MessageCell>
                  </MessageHeader>
                  
                  <MessageContent isOpen={expandedMessages[message.id]}>
                    <MessageField>
                      <h4>Sujet</h4>
                      <p>{message.sujet || 'Sans sujet'}</p>
                    </MessageField>
                    <MessageField>
                      <h4>Message</h4>
                      <p 
                        style={{ whiteSpace: 'pre-wrap' }}
                        ref={el => messageRefs.current[message.id] = el}
                      >
                        {message.message}
                      </p>
                    </MessageField>
                  </MessageContent>
                </MessageRow>
              ))}
            </MessagesTable>
          )}
        </>
      )}
      
      {/* Success popup */}
      <SuccessPopup 
        show={showSuccessPopup} 
        message={successMessage} 
        onHide={() => setShowSuccessPopup(false)}
      />
    </>
  );
};

export default DashboardMessages; 
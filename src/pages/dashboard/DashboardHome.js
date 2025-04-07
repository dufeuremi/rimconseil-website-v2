import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RiPagesLine, RiArticleLine, RiSettings4Line, RiExternalLinkLine, RiBugLine } from 'react-icons/ri';
import BugReportModal from '../../components/BugReportModal';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid var(--color-quaternary);
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--color-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;

  .icon {
    color: var(--color-primary);
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  .icon {
    font-size: 1rem;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 0.75rem;
  transition: all 0.2s;
  color: var(--color-tertiary);

  &:hover {
    background-color: rgba(217, 226, 236, 0.4);
    color: var(--color-primary);
  }
`;

const ItemTitle = styled.span`
  font-weight: 500;
`;

const ItemMeta = styled.span`
  font-size: 0.875rem;
  color: var(--color-tertiary);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid var(--color-quaternary);
  padding: 1rem;
  text-align: center;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.clickable ? 'rgba(217, 226, 236, 0.4)' : 'white'};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-tertiary);
`;

const BugIcon = styled(RiBugLine)`
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const DashboardHome = () => {
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  
  // Données de test
  const stats = [
    { label: 'Pages', value: '12' },
    { label: 'Articles', value: '24' }
  ];

  const recentPages = [
    { title: 'Nos Services', path: '/services', lastModified: 'Il y a 2 jours' },
    { title: 'À Propos', path: '/a-propos', lastModified: 'Il y a 3 jours' },
    { title: 'Contact', path: '/contact', lastModified: 'Il y a 5 jours' }
  ];

  const recentArticles = [
    { title: "L'importance de la transformation digitale", date: '5 mars 2025' },
    { title: 'Les tendances tech de 2025', date: '3 mars 2025' },
    { title: 'Comment optimiser sa stratégie digitale', date: '1 mars 2025' }
  ];

  const menuStructure = [
    {
      title: 'Accueil',
      path: '/dashboard'
    },
    {
      title: 'Nos savoir-faire',
      items: [
        { title: 'Nos expertises', path: '/dashboard/expertises' },
        { title: 'Nos services', path: '/dashboard/services' }
      ]
    },
    {
      title: 'Qui sommes nous?',
      items: [
        { title: 'Nos valeurs', path: '/dashboard/valeurs' },
        { title: 'Notre équipe', path: '/dashboard/equipe' },
        { title: 'Notre réseau', path: '/dashboard/reseau' }
      ]
    },
    {
      title: 'Articles',
      path: '/dashboard/articles'
    },
    {
      title: 'Actualités',
      path: '/dashboard/actualites'
    },
    {
      title: 'Contactez nous',
      path: '/dashboard/contact'
    }
  ];

  return (
    <>
      <h1>Dashboard</h1>
      
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
        <StatCard as="button" onClick={() => setIsBugModalOpen(true)} clickable>
          <BugIcon />
          <StatLabel>Signaler une panne</StatLabel>
        </StatCard>
      </StatsGrid>

      <DashboardGrid>
        <Card>
          <CardHeader>
            <CardTitle>
              <RiPagesLine className="icon" />
              Pages récentes
            </CardTitle>
            <ViewAllLink to="/dashboard/pages">
              Voir tout <RiExternalLinkLine className="icon" />
            </ViewAllLink>
          </CardHeader>
          <List>
            {recentPages.map((page, index) => (
              <ListItem key={index} to={`/dashboard/pages${page.path}`}>
                <ItemTitle>{page.title}</ItemTitle>
                <ItemMeta>{page.lastModified}</ItemMeta>
              </ListItem>
            ))}
          </List>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <RiArticleLine className="icon" />
              Derniers articles
            </CardTitle>
            <ViewAllLink to="/dashboard/articles">
              Voir tout <RiExternalLinkLine className="icon" />
            </ViewAllLink>
          </CardHeader>
          <List>
            {recentArticles.map((article, index) => (
              <ListItem key={index} to="/dashboard/articles">
                <ItemTitle>{article.title}</ItemTitle>
                <ItemMeta>{article.date}</ItemMeta>
              </ListItem>
            ))}
          </List>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <RiSettings4Line className="icon" />
              Structure du site
            </CardTitle>
          </CardHeader>
          <List>
            {menuStructure.map((item, index) => (
              item.items ? (
                <div key={index}>
                  <ItemTitle style={{ color: 'var(--color-secondary)', padding: '0.75rem' }}>{item.title}</ItemTitle>
                  {item.items.map((subItem, subIndex) => (
                    <ListItem key={`${index}-${subIndex}`} to={subItem.path} style={{ paddingLeft: '1.5rem' }}>
                      <ItemTitle style={{ fontStyle: 'italic' }}>{subItem.title}</ItemTitle>
                    </ListItem>
                  ))}
                </div>
              ) : (
                <ListItem key={index} to={item.path}>
                  <ItemTitle>{item.title}</ItemTitle>
                </ListItem>
              )
            ))}
          </List>
        </Card>
      </DashboardGrid>

      <BugReportModal 
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
      />
    </>
  );
};

export default DashboardHome; 
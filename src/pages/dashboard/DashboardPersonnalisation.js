import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Title from '../../components/Title';
import { Pencil, Globe } from '@phosphor-icons/react';

const PersonnalisationContainer = styled.div`
  padding: 0;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PageCard = styled.div`
  background: var(--color-white);
  border: 1px solid var(--dashboard-border-color);
  border-radius: var(--dashboard-radius);
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(44, 119, 227, 0.08);
    border-color: var(--color-primary);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primarylight) 100%);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PageTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--color-primary), var(--color-primarylight));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
`;



const PageDescription = styled.p`
  color: var(--color-text-light);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
`;

const CustomButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  border-radius: 0;
  position: relative;

  &.ghost {
    background: transparent;
    color: var(--color-text);
    border: 1px solid var(--dashboard-border-color);

    &:hover {
      background: var(--color-quaternary);
      transform: translateY(0);
      box-shadow: none;
      color: var(--color-primary);
    }
  }

  &.primary {
    background: linear-gradient(45deg, var(--color-primary) 0%, var(--color-primarylight) 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      color: white;
    }
  }
`;

const pagesData = [
  {
    id: 'home',
    title: 'Accueil',
    path: '/',
    description: 'Page principale du site avec présentation de l\'entreprise et des services principaux.'
  },
  {
    id: 'expertises',
    title: 'Expertises',
    path: '/expertises',
    description: 'Présentation détaillée de nos domaines d\'expertise et compétences techniques.'
  },
  {
    id: 'services',
    title: 'Services',
    path: '/services',
    description: 'Catalogue complet de nos services et solutions pour les entreprises.'
  },
  {
    id: 'valeurs',
    title: 'Valeurs',
    path: '/valeurs',
    description: 'Nos valeurs fondamentales et notre vision d\'entreprise.'
  },
  {
    id: 'enjeux',
    title: 'Enjeux',
    path: '/enjeux',
    description: 'Les enjeux actuels et futurs de notre secteur d\'activité.'
  },
  {
    id: 'equipe',
    title: 'Notre Équipe',
    path: '/equipe',
    description: 'Présentation de notre équipe et de nos collaborateurs.'
  },
  {
    id: 'reseau',
    title: 'Notre Réseau',
    path: '/reseau',
    description: 'Notre réseau de partenaires et nos implantations géographiques.'
  },

];



const DashboardPersonnalisation = () => {
  const navigate = useNavigate();

  const handleEditPage = (pageId) => {
    navigate(`/dashboard/personnalisation/edit/${pageId}`);
  };

  const handleViewPage = (path) => {
    window.open(path, '_blank');
  };

  return (
    <PersonnalisationContainer>
      <Title level={1}>Personnalisation</Title>

      
      <CardsGrid>
        {pagesData.map(page => (
          <PageCard key={page.id}>
                         <CardHeader>
               <PageTitle>
                 <PageIcon>
                   {page.title.charAt(0).toUpperCase()}
                 </PageIcon>
                 {page.title}
               </PageTitle>
             </CardHeader>
            
                         <PageDescription>
               {page.description}
             </PageDescription>
             
             <CardActions>
               <CustomButton 
                 className="ghost" 
                 onClick={() => handleViewPage(page.path)}
               >
                 <Globe size={16} />
                 Découvrir
               </CustomButton>
               <CustomButton 
                 className="primary" 
                 onClick={() => handleEditPage(page.id)}
               >
                 <Pencil size={16} />
                 Découvrir
               </CustomButton>
             </CardActions>
          </PageCard>
        ))}
      </CardsGrid>
    </PersonnalisationContainer>
  );
};

export default DashboardPersonnalisation; 
import React from 'react';
import Page from '../../components/Page';
import styled from 'styled-components';
import Title from '../../components/Title';

const PagesContainer = styled.div`
  padding: 0;
`;

const pagesData = [
  {
    id: 1,
    title: "Titre de la page",
    path: "/chemindelapage",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.",
    categories: ["Catégorie", "Catégorie", "Catégorie", "Catégorie", "Catégorie"]
  },
  {
    id: 2,
    title: "Nos Services",
    path: "/services",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.",
    categories: ["Services", "Entreprise", "Solutions", "Consulting"]
  },
  {
    id: 3,
    title: "À Propos",
    path: "/a-propos",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.",
    categories: ["Entreprise", "Histoire", "Équipe"]
  }
];

const DashboardPages = () => {
  return (
    <>
      <Title>Gestion des Actus</Title>
      <PagesContainer>
        {pagesData.map(page => (
          <Page
            key={page.id}
            title={page.title}
            path={page.path}
            description={page.description}
            categories={page.categories}
            direction="ltr"
          />
        ))}
      </PagesContainer>
    </>
  );
};

export default DashboardPages; 
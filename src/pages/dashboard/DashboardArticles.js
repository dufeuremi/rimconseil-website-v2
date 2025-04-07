import React from 'react';
import Article from '../../components/Article';
import styled from 'styled-components';
import Title from '../../components/Title';

const ArticlesContainer = styled.div`
  padding: 0;
`;

const articlesData = [
  {
    id: 1,
    title: "Titre de l'actu",
    date: "5 mars 2025",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.",
    imageUrl: "/images/article-illustration.svg"
  },
  {
    id: 2,
    title: "L'importance de la transformation digitale",
    date: "3 mars 2025",
    description: "La transformation digitale est devenue un enjeu majeur pour les entreprises. Découvrez comment adapter votre stratégie pour rester compétitif dans un monde en constante évolution.",
    imageUrl: "/images/article-illustration.svg"
  },
  {
    id: 3,
    title: "Les tendances tech de 2025",
    date: "1 mars 2025",
    description: "Intelligence artificielle, blockchain, IoT : quelles sont les technologies qui vont révolutionner le monde des affaires ? Analyse des tendances à surveiller.",
    imageUrl: "/images/article-illustration.svg"
  }
];

const DashboardArticles = () => {
  return (
    <>
      <Title>Gestion des Articles</Title>
      <ArticlesContainer>
        {articlesData.map(article => (
          <Article
            key={article.id}
            title={article.title}
            date={article.date}
            description={article.description}
            imageUrl={article.imageUrl}
          />
        ))}
      </ArticlesContainer>
    </>
  );
};

export default DashboardArticles; 
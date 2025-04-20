import React from 'react';
import styled from 'styled-components';
import TeamMember from '../components/TeamMember';
import Title from '../components/Title';
import ZoneIntervention from '../components/ZoneIntervention';
import intervenantImg from '../assets/images/intervenant1.png';

// Styles pour la page
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
  margin-top: 2.5rem;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 3.5rem;
  max-width: 800px;
  text-align: left;
`;

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

// Composant principal de la page
const NotreEquipe = () => {
  // Données des membres de l'équipe
  const teamMembers = [
    {
      name: "Jean-Philippe Robin",
      role: "Consultant en organisation et en transformation numérique",
      bio: [
        "Mes expériences passées, à la fois en tant que consultant et manager d'un Département Data et Digital au sein d'une direction de la transformation, me permettent de savoir bien connecter Business, Data et Digital.",
        "En comprenant le business model de mes clients, leur stratégie, leur organisation et leur écosystème, je suis en mesure de mettre en place des stratégies applicatives qui permettent d'allier ce qu'il est utile de faire avec ce qu'il est possible de faire (humainement et techniquement) et d'accompagner et mobiliser les personnes."
      ],
      email: "info@rimconseil.fr",
      phone: "(FR) 06 11 70 90 16",
      linkedin: "https://www.linkedin.com",
      image: intervenantImg
    },
    {
      name: "Loubna Berrado-Robin",
      role: "Consultante en organisation et en transformation numérique",
      bio: [
        "Études et méthodologies : analyse des projets et proposition de méthodes d'accompagnement adaptées.Audit organisationnel et SI : diagnostic des points faibles et des leviers, évaluation des outils et usages SI, analyse des processus métiers. Transformation numérique : définition du SI cible (stratégie, métier, applicatif), recueil des besoins utilisateurs, modélisation des processus cibles, accompagnement au changement. Plan de transformation SI : élaboration de la feuille de route, rédaction de cahiers des charges et de spécifications fonctionnelles. Mise en œuvre de solutions IT : aide au choix des outils, réalisation des plans de tests, accompagnement à la recette et à la formation des utilisateurs.",
      ],
      email: "loubna@rimconseil.fr",
      phone: "(FR) 06 01 02 03 04",
      linkedin: "https://www.linkedin.com"
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title level={1} align="center">Notre équipe</Title>
      </Header>
      <PageDescription>
        Rim'conseil évolue avec Jean-Philippe Robin, intervenant au service de votre entreprise et Loubna Berrado-Robin, Consultante en organisation et en transformation numérique.
      </PageDescription>
      
      <TeamContainer>
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            name={member.name}
            role={member.role}
            bio={member.bio}
            email={member.email}
            phone={member.phone}
            linkedin={member.linkedin}
            location={member.location}
            image={member.image}
          />
        ))}
      </TeamContainer>
      
      <ZoneIntervention />
    </PageContainer>
  );
};

export default NotreEquipe;
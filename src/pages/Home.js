import React from 'react';
import styled from 'styled-components';
import { RiArrowRightLine } from 'react-icons/ri';
import Header from '../components/Header';
import Button from '../components/Button';
import Title from '../components/Title';
import ExpertiseSection from '../components/ExpertiseSection';
import EnjeuxSection from '../components/EnjeuxSection';
import ValuesSection from '../components/ValuesSection';
import ClientsSection from '../components/ClientsSection';
import PartnersSection from '../components/PartnersSection';
import ZoneIntervention from '../components/ZoneIntervention';

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: white;
`;

const HeroSection = styled.div`
  max-width: 1280px;
  margin: 8rem auto 0;
  padding: 0 5rem;
  text-align: left;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
`;

const TitleHighlight = styled.span`
  color: var(--color-primary);
`;

const Description = styled.p`
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      <HeroSection>
        <Subtitle>Conseil et accompagnement d'entreprise</Subtitle>
        <Title level={1} align="left">
          Piloter l'IT avec <TitleHighlight>sens.</TitleHighlight>
        </Title>
        <Description>
          Votre partenaire pour co-construire vos solutions IT responsables qui allient innovation et respect des valeurs écologiques et sociales
        </Description>
        <Button arrow={true}>
          Découvrir
        </Button>
      </HeroSection>
      
      {/* Section d'expertise */}
      <ExpertiseSection />
      <EnjeuxSection />
      <ValuesSection />
      <ZoneIntervention />
      <ClientsSection />
      <PartnersSection />
    </HomeContainer>
  );
};

export default Home; 
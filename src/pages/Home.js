import React, { useEffect, useState } from 'react';
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
  margin: 0;
  padding: 0;
`;

const SectionContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  margin: 0;

  &.hero-section {
    padding-top: 0;
    margin-top: 0;
    position: relative;
    overflow: hidden;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${require('../assets/images/background.png')});
  background-size: cover;
  background-position: center;
  z-index: -1;
  opacity: 1;
`;

const HeroSection = styled.div`
  max-width: 1280px;
  width: 100%;
  padding: 96px 5rem 0 5rem;
  text-align: left;
  margin-top: 0;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 96px 2rem 0 2rem;
  }
  // background-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const TitleHighlight = styled.span`
  background: linear-gradient(45deg, ${props => props.theme.colors.greenLight}, ${props => props.theme.colors.greenDark});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #fff;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
  font-weight: 500;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      <SectionContainer className="hero-section">
        <BackgroundImage />
        <HeroSection>
          <Subtitle>Conseil et accompagnement d'entreprise</Subtitle>
          <Title level={1} align="center" variant="page-title" style={{ color: '#fff', fontWeight: 600 }}>
            Piloter l'IT avec <TitleHighlight>sens.</TitleHighlight>
          </Title>
          <Description>
            Votre partenaire pour co-construire vos solutions IT responsables qui allient innovation et respect des valeurs écologiques et sociales
          </Description>
          <Button arrow={true}>
            Découvrir
          </Button>
        </HeroSection>
      </SectionContainer>
      
      <SectionContainer>
        <ExpertiseSection />
      </SectionContainer>

      <SectionContainer>
        <EnjeuxSection />
      </SectionContainer>

      <SectionContainer>
        <ValuesSection />
      </SectionContainer>

      <SectionContainer>
        <PartnersSection />
      </SectionContainer>

      <SectionContainer>
        <ClientsSection />
      </SectionContainer>

      <SectionContainer>
        <ZoneIntervention />
      </SectionContainer>
    </HomeContainer>
  );
};

export default Home; 
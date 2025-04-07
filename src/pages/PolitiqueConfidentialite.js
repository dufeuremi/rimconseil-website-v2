import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: white;
`;

const ContentSection = styled.div`
  max-width: 1280px;
  margin: 8rem auto 4rem;
  padding: 0 5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1F2937;
  margin-bottom: 3rem;
  font-weight: 600;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #3B82F6;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const Content = styled.div`
  color: #4B5563;
  font-size: 1.125rem;
  line-height: 1.7;

  p {
    margin-bottom: 1rem;
  }

  strong {
    color: #1F2937;
    font-weight: 600;
  }

  ul {
    list-style-type: disc;
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const InfoBox = styled.div`
  background-color: #F3F4F6;
  padding: 2rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
`;

const PolitiqueConfidentialite = () => {
  return (
    <PageContainer>
      <Header />
      <ContentSection>
        <Title>Politique de Confidentialité</Title>

        <Section>
          <SectionTitle>1. Collecte des données personnelles</SectionTitle>
          <Content>
            <p>RIM'CONSEIL collecte les données suivantes via son formulaire de contact :</p>
            <ul>
              <li>Nom</li>
              <li>Email</li>
              <li>Téléphone</li>
            </ul>
            <p>Ces données sont collectées uniquement à des fins de communication avec les utilisateurs.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>2. Utilisation des données</SectionTitle>
          <Content>
            <p>Les données personnelles sont utilisées pour :</p>
            <ul>
              <li>Répondre aux demandes des utilisateurs via le formulaire de contact.</li>
            </ul>
            <p><strong>Important :</strong> Aucune donnée n'est vendue ou cédée à des tiers.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>3. Conservation des données</SectionTitle>
          <Content>
            <p>Les données collectées sont conservées pendant une durée maximale de 3 ans après le dernier contact.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>4. Droits des utilisateurs</SectionTitle>
          <Content>
            <InfoBox>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul>
                <li>Droit d'accès, de rectification et de suppression de vos données</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition et de limitation du traitement</li>
              </ul>
            </InfoBox>
            <p>Vous pouvez exercer ces droits en envoyant un email à contact@rimconseil.fr</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>5. Cookies</SectionTitle>
          <Content>
            <p>Le site utilise des cookies pour améliorer l'expérience utilisateur. Une bannière permet d'accepter ou de refuser ces cookies lors de la première visite.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>6. Sécurité des données</SectionTitle>
          <Content>
            <p>RIM'CONSEIL met en place des mesures de sécurité pour protéger les données personnelles contre l'accès non autorisé.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>7. Modification de la politique de confidentialité</SectionTitle>
          <Content>
            <p>RIM'CONSEIL se réserve le droit de modifier cette politique à tout moment. La version la plus récente sera toujours disponible sur le site.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>8. Contact</SectionTitle>
          <Content>
            <p>Pour toute question relative à la protection des données, contactez-nous à contact@rimconseil.fr</p>
          </Content>
        </Section>
      </ContentSection>
    </PageContainer>
  );
};

export default PolitiqueConfidentialite; 
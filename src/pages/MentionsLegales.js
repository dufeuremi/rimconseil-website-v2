import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Text from '../components/Text';
import Title from '../components/Title';

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
  margin-bottom: 1rem;
`;

const CompanyInfo = styled.div`
  background-color: #F3F4F6;
  padding: 2rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
`;

const MentionsLegales = () => {
  return (
    <PageContainer>
      <Header />
      <ContentSection>
        <Title>Mentions Légales</Title>

        <Section>
          <SectionTitle>1. Présentation du site</SectionTitle>
          <Content>
            <CompanyInfo>
              <Text variant="body"><strong>Le site RIM'CONSEIL est édité par :</strong></Text>
              <Text variant="body">RIM'CONSEIL, SAS</Text>
              <Text variant="body">RCS : 919 204 305</Text>
              <Text variant="body">Siège social : 7 rue Gounod, 35000 Rennes</Text>
              <Text variant="body">SIRET : 919 204 305 00016</Text>
              <Text variant="body">N° TVA Intracommunautaire : FR24 919 204 305</Text>
              <Text variant="body">Code NAF/APE : 70.22Z (Conseil pour les affaires et autres conseils de gestion)</Text>
            </CompanyInfo>
            <Text variant="body"><strong>Responsable de publication :</strong> Jean-Philippe Robin</Text>
            <Text variant="body"><strong>Contact :</strong> info@rimconseil.fr</Text>
            <Text variant="body"><strong>Hébergeur :</strong> OVH (2 rue Kellermann, 59100 Roubaix, France)</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>2. Propriété intellectuelle</SectionTitle>
          <Content>
            <Text variant="body">Le contenu du site (textes, images, graphismes, logos, icônes) est la propriété exclusive de RIM'CONSEIL, sauf mentions contraires. Toute reproduction, distribution, modification, adaptation est interdite sans autorisation préalable.</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>3. Responsabilités</SectionTitle>
          <Content>
            <Text variant="body">RIM'CONSEIL s'efforce de fournir des informations exactes et mises à jour. Toutefois, la société ne saurait être tenue responsable des erreurs ou omissions, ni des dommages résultant de l'utilisation du site.</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>4. Liens hypertextes</SectionTitle>
          <Content>
            <Text variant="body">Le site peut contenir des liens vers d'autres sites. RIM'CONSEIL n'est pas responsable du contenu de ces sites externes.</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>5. Droit applicable</SectionTitle>
          <Content>
            <Text variant="body">Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux de Rennes seront compétents.</Text>
          </Content>
        </Section>
      </ContentSection>
    </PageContainer>
  );
};

export default MentionsLegales; 
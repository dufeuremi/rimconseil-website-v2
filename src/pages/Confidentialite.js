import React from 'react';
import styled from 'styled-components';
import Title from '../components/Title';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: white;
`;

const ContentSection = styled.div`
  max-width: 1280px;
  margin: 4rem auto;
  padding: 0 5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 3rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const Content = styled.div`
  color: var(--color-text);
  font-size: 1.125rem;
  line-height: 1.7;

  p {
    margin-bottom: 1rem;
  }

  strong {
    color: var(--color-secondary);
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
  border-radius: 0;
  margin-bottom: 2rem;
`;

const Confidentialite = () => {
  return (
    <PageContainer>
      <ContentSection>
        <TitleContainer>
          <Title level={1} align="left">Politique de Confidentialité</Title>
        </TitleContainer>

        <Section>
          <SectionTitle>Introduction</SectionTitle>
          <Content>
            <p>RIM'CONSEIL s'engage à protéger la vie privée de ses utilisateurs. La présente politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous visitez notre site web et utilisez nos services.</p>
            <p>Cette politique s'applique au site web de RIM'CONSEIL et à tous les services associés.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Données collectées</SectionTitle>
          <Content>
            <p>Dans le cadre de notre activité de site vitrine, nous collectons les types de données suivants :</p>
            <ul>
              <li><strong>Données de contact</strong> : nom, prénom, adresse email, numéro de téléphone, entreprise</li>
              <li><strong>Données de navigation</strong> : adresse IP, cookies, type de navigateur, pages visitées</li>
              <li><strong>Demandes de contact</strong> : contenu des messages que vous nous envoyez via notre formulaire de contact</li>
            </ul>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Finalités du traitement</SectionTitle>
          <Content>
            <p>Nous utilisons vos données personnelles aux fins suivantes :</p>
            <ul>
              <li>Répondre à vos demandes d'information</li>
              <li>Vous fournir les services que vous avez demandés</li>
              <li>Améliorer notre site web et nos services</li>
              <li>Vous tenir informé de nos actualités et offres (uniquement avec votre consentement)</li>
              <li>Respecter nos obligations légales et réglementaires</li>
            </ul>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Base légale du traitement</SectionTitle>
          <Content>
            <InfoBox>
              <p>Le traitement de vos données personnelles est fondé sur :</p>
              <ul>
                <li><strong>Votre consentement</strong> : lorsque vous remplissez un formulaire de contact</li>
                <li><strong>L'intérêt légitime</strong> : pour améliorer notre site et services</li>
                <li><strong>L'exécution d'un contrat</strong> : lorsque vous utilisez nos services</li>
                <li><strong>Nos obligations légales</strong> : pour respecter la législation applicable</li>
              </ul>
            </InfoBox>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Durée de conservation</SectionTitle>
          <Content>
            <p>Nous conservons vos données personnelles pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, sauf disposition légale contraire :</p>
            <ul>
              <li>Données de contact : 3 ans à compter du dernier contact</li>
              <li>Données de navigation : 13 mois maximum</li>
              <li>Données relatives aux prospects : 3 ans à compter de la collecte ou du dernier contact</li>
            </ul>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Cookies et technologies similaires</SectionTitle>
          <Content>
            <p>Notre site utilise des cookies et technologies similaires pour améliorer votre expérience de navigation. Ces technologies nous permettent de :</p>
            <ul>
              <li>Assurer le bon fonctionnement du site</li>
              <li>Mesurer l'audience et comprendre comment le site est utilisé</li>
              <li>Personnaliser votre expérience</li>
            </ul>
            <p>Vous pouvez gérer vos préférences en matière de cookies via notre bandeau de cookies lors de votre première visite, ou à tout moment en modifiant les paramètres de votre navigateur.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Vos droits</SectionTitle>
          <Content>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès</strong> : vous pouvez obtenir une copie de vos données personnelles que nous détenons</li>
              <li><strong>Droit de rectification</strong> : vous pouvez demander la correction des données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de vos données</li>
              <li><strong>Droit à la limitation du traitement</strong> : vous pouvez demander de limiter l'utilisation de vos données</li>
              <li><strong>Droit à la portabilité</strong> : vous pouvez récupérer vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> : vous pouvez vous opposer au traitement de vos données</li>
            </ul>
            <p>Pour exercer ces droits, contactez-nous à l'adresse : <strong>info@rimconseil.fr</strong>.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Sécurité des données</SectionTitle>
          <Content>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération ou la destruction.</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Partage des données</SectionTitle>
          <Content>
            <p>Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager vos données avec :</p>
            <ul>
              <li>Nos sous-traitants (hébergeur, prestataires techniques, etc.) qui agissent selon nos instructions</li>
              <li>Les autorités publiques, si la loi l'exige</li>
            </ul>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Modifications de la politique</SectionTitle>
          <Content>
            <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. La version la plus récente sera toujours disponible sur notre site web avec sa date de dernière mise à jour.</p>
            <p>Date de dernière mise à jour : Avril 2025</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>Contact</SectionTitle>
          <Content>
            <InfoBox>
              <p><strong>RIM'CONSEIL</strong></p>
              <p>7 rue Gounod, 35000 Rennes</p>
              <p>Email : info@rimconseil.fr</p>
              <p>Téléphone : +33 (0)2 XX XX XX XX</p>
            </InfoBox>
            <p>Si vous avez des questions concernant cette politique de confidentialité ou la manière dont nous traitons vos données personnelles, n'hésitez pas à nous contacter.</p>
          </Content>
        </Section>
      </ContentSection>
    </PageContainer>
  );
};

export default Confidentialite; 
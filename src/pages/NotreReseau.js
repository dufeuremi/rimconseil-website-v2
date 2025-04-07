import React from 'react';
import styled from 'styled-components';
import Title from '../components/Title';
import Text from '../components/Text';
import partenairesImage from '../assets/images/partenaires.png';
import clientsImage from '../assets/images/clients.png';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Description = styled.div`
  max-width: 800px;
  margin: 0 auto 4rem auto;
  text-align: center;
  line-height: 1.6;
`;

const PartnersContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 100%;
`;

const PartnersImage = styled.img`
  max-width: 100%;
  height: auto;
  
  /* Fallback pour les images qui ne se chargent pas */
  &.error {
    display: none;
  }
`;

const FallbackText = styled.div`
  display: none;
  text-align: center;
  color: var(--color-tertiary);
  padding: 2rem;
  
  &.visible {
    display: block;
  }
`;

const ClientsSection = styled.section`
  margin-top: 5rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const ClientsTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 3rem;
  text-align: center;
`;

const ClientsImage = styled.img`
  max-width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
`;

const NotreReseau = () => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <PageContainer>
      <Header>
        <Title level={1} align="center">Notre réseau</Title>
      </Header>
      
      <Description>
        <Text align="center">
          Rim conseil coopère avec des entreprises partenaires pour diversifier les services proposés. 
          Grâce à notre réseau de partenaires experts dans différents domaines, nous sommes en mesure 
          d'offrir des solutions complètes qui répondent à tous vos besoins informatiques et stratégiques. 
          Cette complémentarité nous permet d'assembler les meilleures compétences pour chaque projet, 
          garantissant ainsi des résultats optimaux et adaptés à votre contexte spécifique.
        </Text>
      </Description>
      
      <PartnersContainer>
        <PartnersImage 
          src={partenairesImage} 
          alt="Nos partenaires: Parteam, Bevoak, Blocnet, Polynom, Colibee, IBM" 
          className={imageError ? 'error' : ''}
          onError={handleImageError}
        />
        <FallbackText className={imageError ? 'visible' : ''}>
          Nos partenaires incluent Parteam, Bevoak, Blocnet, Polynom, Colibee et IBM, qui nous permettent
          d'offrir une gamme complète de services informatiques et stratégiques.
        </FallbackText>
      </PartnersContainer>
      
      <ClientsSection>
        <ClientsTitle>Ils approuvent notre expertise</ClientsTitle>
        <ClientsImage src={clientsImage} alt="Nos clients" />
      </ClientsSection>
    </PageContainer>
  );
};

export default NotreReseau; 
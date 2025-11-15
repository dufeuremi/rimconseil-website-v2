import React from 'react';
import styled from 'styled-components';
import Title from './Title';
import excelcioLogo from '../assets/images/excelcio_logo.png';
import bevoakLogo from '../assets/images/partenaires/bevoak.jpg';
import parteamLogo from '../assets/images/partenaires/parteam.avif';
import blocnetLogo from '../assets/images/partenaires/blocnet.png';
import polynomLogo from '../assets/images/partenaires/polynom.png';
import colibeeLogo from '../assets/images/partenaires/colibee.png';

const SectionContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: var(--color-text);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const PartnersContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 100%;
`;

const PartnerLogo = styled.img`
  height: 80px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    opacity: 0.8;
  }
  
  /* Fallback pour les images qui ne se chargent pas */
  &.error {
    display: none;
  }
`;

const PartnerLink = styled.a`
  display: inline-block;
  text-decoration: none;
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

const PartnersSection = () => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const partners = [
    { name: 'Bevoak', logo: bevoakLogo, url: 'https://bevoak.com/' },
    { name: 'Parteam', logo: parteamLogo, url: 'https://www.parteam.fr/' },
    { name: 'Excelcio', logo: excelcioLogo, url: 'https://excelcio.com/' },
    { name: 'Blocnet', logo: blocnetLogo, url: 'https://www.blocnet.fr/' },
    { name: 'Polynom', logo: polynomLogo, url: 'https://www.polynom.io/fr' },
    { name: 'Colibee', logo: colibeeLogo, url: 'https://www.colibee.com/' }
  ];

  return (
    <SectionContainer>
      <TitleContainer>
        <Title level={1} align="center" variant="page-title">Nos partenaires</Title>
      </TitleContainer>
      <SectionDescription>
        Rim conseil coopère avec des entreprises partenaires pour diversifier les services proposés. 
        Grâce à notre réseau de partenaires experts dans différents domaines, nous sommes en mesure 
        d'offrir des solutions complètes qui répondent à tous vos besoins informatiques et stratégiques.
      </SectionDescription>
      
      <PartnersContainer>
        {partners.map((partner, index) => (
          <PartnerLink 
            key={index}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Visitez ${partner.name}`}
          >
            <PartnerLogo 
              src={partner.logo} 
              alt={partner.name}
              onError={handleImageError}
            />
          </PartnerLink>
        ))}
        
        <FallbackText className={imageError ? 'visible' : ''}>
          Nos partenaires nous permettent d'offrir une gamme complète de services informatiques et stratégiques.
        </FallbackText>
      </PartnersContainer>
    </SectionContainer>
  );
};

export default PartnersSection; 
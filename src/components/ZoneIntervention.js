import React, { useState } from 'react';
import styled from 'styled-components';
import franceSvg from '../assets/images/france_map.svg';
import Text from './Text';
import Title from './Title';

const SectionContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Description = styled(Text)`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  text-align: left;
  /* Reduced readable width */
  max-width: 800px;
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
  align-self: center;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Map = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  
  img, object {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ImageFallback = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-light-bg);
  color: var(--color-text);
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
`;

const ZoneIntervention = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <SectionContainer>
      <Title level={1} align="center" variant="page-title">Zone d'intervention</Title>
      <Description variant="body">
        RIM Conseil intervient sur l'ensemble du territoire français et au Maroc. 
        Nous proposons nos services de conseil en systèmes d'information aux entreprises 
        et organismes publics dans ces zones géographiques.
      </Description>

      <MapContainer>
        {imageError ? (
          <ImageFallback>
            Carte de France non disponible
          </ImageFallback>
        ) : (
          <Map>
            <object
              id="france-map"
              data={franceSvg}
              type="image/svg+xml"
              onError={handleImageError}
              aria-label="Carte de France"
            />
          </Map>
        )}
      </MapContainer>
    </SectionContainer>
  );
};

export default ZoneIntervention; 
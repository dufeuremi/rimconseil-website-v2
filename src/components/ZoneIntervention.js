import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';
import LocationTag from './LocationTag';
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

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Description = styled(Text)`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 800px;
  text-align: left;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftContent = styled.div`
  flex: 1;
`;

const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
  max-width: 451px;
  
  img, object {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;
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

const ContactButton = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-start;
`;

const AnimatedPoint = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--color-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 3px white, 0 0 5px rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, left 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;
`;

const OtherButton = styled.div`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  margin: 0.5rem;
  background-color: white;
  border: 1px dashed var(--color-primary);
  font-size: 0.9rem;
  color: var(--color-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(44, 119, 227, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const ZoneIntervention = () => {
  const [activeCity, setActiveCity] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [pointVisible, setPointVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const animatedPointRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Locations grouped by country
  const locations = {
    france: [
      'Rennes', 'Paris', 'Nantes', 'Brest', 'Angers', 
      'Laval', 'Lorient', 'Quimper', 'St-Malo', 
      'St-Brieuc', 'Vannes', 'Morlaix',
      'Caen', 'Le Mans', 'Tours', 'Cholet', 
      'Poitiers'
    ]
  };

  // Coordonnées géographiques des villes (longitude, latitude)
  const geoCoordinates = {
    // Bretagne
    brest: { lng: -4.48, lat: 48.39 },
    morlaix: { lng: -3.83, lat: 48.58 },
    quimper: { lng: -4.10, lat: 48.00 },
    lorient: { lng: -3.37, lat: 47.75 },
    vannes: { lng: -2.76, lat: 47.66 },
    stbrieuc: { lng: -2.76, lat: 48.51 },
    stmalo: { lng: -2.03, lat: 48.65 },
    rennes: { lng: -1.68, lat: 48.11 },
    
    // Pays de la Loire
    laval: { lng: -0.77, lat: 48.07 },
    angers: { lng: -0.55, lat: 47.47 },
    nantes: { lng: -1.55, lat: 47.22 },
    lemans: { lng: 0.20, lat: 48.00 },
    cholet: { lng: -0.88, lat: 47.06 },
    
    // Normandie
    caen: { lng: -0.36, lat: 49.18 },
    
    // Centre-Val de Loire
    tours: { lng: 0.69, lat: 47.39 },
    
    // Nouvelle-Aquitaine
    poitiers: { lng: 0.34, lat: 46.58 },
    
    // Région parisienne
    paris: { lng: 2.35, lat: 48.85 }
  };

  // Limites géographiques de la France métropolitaine pour la normalisation
  // Ajustées pour mieux correspondre à l'image PNG
  const geoLimits = {
    minLng: -5.5,   // Longitude minimale (ouest)
    maxLng: 9.5,    // Longitude maximale (est)
    minLat: 41.0,   // Latitude minimale (sud) 
    maxLat: 51.5    // Latitude maximale (nord)
  };

  // Convertir des coordonnées géographiques en coordonnées sur l'image
  const geoToImageCoordinates = (lng, lat, imageWidth, imageHeight) => {
    // Normaliser les coordonnées géographiques entre 0 et 1
    const normalizedX = (lng - geoLimits.minLng) / (geoLimits.maxLng - geoLimits.minLng);
    // Inverser Y car la latitude augmente vers le nord, mais Y augmente vers le bas dans une image
    const normalizedY = 1 - (lat - geoLimits.minLat) / (geoLimits.maxLat - geoLimits.minLat);
    
    // Multiplier par les dimensions de l'image
    return {
      x: (normalizedX * imageWidth) - 10,
      y: normalizedY * imageHeight
    };
  };

  // Placer le point sur la carte
  const placePointOnMap = (city) => {
    // Get the city ID in lowercase with no special characters or spaces
    const cityId = city.toLowerCase()
      .replace(/['-]/g, '')
      .replace(/\s+/g, ''); // Cette ligne supprime les espaces
    
    // Récupérer les coordonnées géographiques de la ville
    const geoPosition = geoCoordinates[cityId];
    
    if (geoPosition && mapContainerRef.current) {
      // Dimensions actuelles de l'image affichée
      const mapRect = mapContainerRef.current.getBoundingClientRect();
      const imgElement = document.getElementById('france-map');
      const imgWidth = imgElement?.clientWidth || mapRect.width;
      const imgHeight = imgElement?.clientHeight || mapRect.height;
      
      // Convertir les coordonnées géographiques en coordonnées sur l'image
      const imageCoords = geoToImageCoordinates(
        geoPosition.lng, 
        geoPosition.lat, 
        imgWidth,
        imgHeight
      );
      
      // Mettre à jour la position du point
      setPointPosition({ x: imageCoords.x, y: imageCoords.y });
      setPointVisible(true);
    }
  };

  const handleMouseEnter = (city) => {
    // Si aucune ville n'est sélectionnée, ou si la ville survolée est différente de la ville sélectionnée
    if (!selectedCity || city !== selectedCity) {
      setActiveCity(city);
      placePointOnMap(city);
    }
  };

  const handleMouseLeave = () => {
    // Si une ville est sélectionnée, revenir à la ville sélectionnée
    if (selectedCity) {
      setActiveCity(selectedCity);
      placePointOnMap(selectedCity);
    } else {
      // Sinon, masquer le point
      setActiveCity(null);
      setPointVisible(false);
    }
  };

  const handleLocationClick = (city) => {
    if (selectedCity === city) {
      // Si la ville cliquée est déjà sélectionnée, la désélectionner
      setSelectedCity(null);
      setActiveCity(null);
      setPointVisible(false);
    } else {
      // Sinon, sélectionner la nouvelle ville
      setSelectedCity(city);
      setActiveCity(city);
      placePointOnMap(city);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle SVG load events
  useEffect(() => {
    const franceMap = document.getElementById('france-map');
    
    if (franceMap) {
      franceMap.onload = () => {
        setMapLoaded(true);
      };
    }
    
    return () => {
      if (franceMap) franceMap.onload = null;
    };
  }, []);

  // Appliquer la position du point avec effet de transition
  useEffect(() => {
    if (animatedPointRef.current) {
      animatedPointRef.current.style.left = `${pointPosition.x}px`;
      animatedPointRef.current.style.top = `${pointPosition.y}px`;
      animatedPointRef.current.style.opacity = pointVisible ? '1' : '0';
    }
  }, [pointPosition, pointVisible]);

  return (
    <SectionContainer>
       <Title level={2} align="center">Notre zone d'intervention</Title>
      <Description variant="body">
        RIM Conseil intervient sur l'ensemble du territoire français et au Maroc. 
        Nous proposons nos services de conseil en systèmes d'information aux entreprises 
        et organismes publics dans ces zones géographiques.
      </Description>
      
      <ContentContainer>
        <LeftContent>
          <TagsContainer>
            {[...locations.france].map(location => (
              <LocationTag 
                key={location} 
                name={location} 
                onMouseEnter={() => handleMouseEnter(location)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleLocationClick(location)}
                active={activeCity === location || selectedCity === location}
              />
            ))}
            <OtherButton>Autre...</OtherButton>
          </TagsContainer>
          
          <ContactButton>
            <Button variant="primary" arrow>
              Nous contacter
            </Button>
          </ContactButton>
        </LeftContent>
        
        <RightContent>
          <MapContainer ref={mapContainerRef}>
            {imageError ? (
              <ImageFallback>
                Carte de France non disponible
              </ImageFallback>
            ) : (
              <Map>
                <AnimatedPoint ref={animatedPointRef} />
                <object
                  id="france-map"
                  data={franceSvg}
                  type="image/svg+xml"
                  onLoad={() => setMapLoaded(true)}
                  onError={handleImageError}
                  aria-label="Carte de France avec les villes d'intervention"
                />
              </Map>
            )}
          </MapContainer>
        </RightContent>
      </ContentContainer>
    </SectionContainer>
  );
};

export default ZoneIntervention; 
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import LocationTag from '../components/LocationTag';
import franceSvg from '../assets/images/france_map.svg';

const PageContainer = styled.div`
  padding: 0 2rem 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  text-align: left;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text);
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
  transition: opacity 0.3s ease;
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

const Secteurs = () => {
  const [activeCity, setActiveCity] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
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

  // Handle SVG load events
  useEffect(() => {
    const franceMap = document.getElementById('france-map');
    
    if (franceMap) {
      franceMap.onload = () => {
        setMapLoaded(true);
        
        // Masquer tous les points dans le SVG
        const svgDoc = franceMap.contentDocument;
        if (svgDoc) {
          const circles = svgDoc.querySelectorAll('circle');
          circles.forEach(circle => {
            circle.style.opacity = '0';
          });
        }
      };
    }
    
    return () => {
      if (franceMap) franceMap.onload = null;
    };
  }, []);

  const handleMouseEnter = (city, event) => {
    // Enregistrer la ville active
    setActiveCity(city);
    
    // Get the city ID in lowercase with no special characters
    const cityId = city.toLowerCase().replace(/['-]/g, '');
    
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
      
      // Positionner et afficher le point directement à l'emplacement de la ville
      if (animatedPointRef.current) {
        // Positionner d'abord avec la transition désactivée
        animatedPointRef.current.style.transition = 'none';
        animatedPointRef.current.style.left = `${imageCoords.x}px`;
        animatedPointRef.current.style.top = `${imageCoords.y}px`;
        
        // Forcer un reflow pour appliquer la position
        const _ = animatedPointRef.current.offsetHeight;
        
        // Activer la transition pour l'opacité et faire apparaître le point
        animatedPointRef.current.style.transition = 'opacity 0.3s ease';
        animatedPointRef.current.style.opacity = '1';
      }
    }
  };

  const handleMouseLeave = () => {
    setActiveCity(null);
    
    // Masquer le point animé
    if (animatedPointRef.current) {
      animatedPointRef.current.style.opacity = '0';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <PageContainer>
      <PageTitle>Secteurs d'intervention</PageTitle>
      <PageDescription>
        RIM Conseil intervient sur l'ensemble du territoire français et au Maroc. 
        Nous proposons nos services de conseil en systèmes d'information aux entreprises 
        et organismes publics dans ces zones géographiques.
      </PageDescription>
      
      <ContentContainer>
        <LeftContent>
          <TagsContainer>
            {[...locations.france].map(location => (
              <LocationTag 
                key={location} 
                name={location} 
                onMouseEnter={(name, e) => handleMouseEnter(name, e)}
                onMouseLeave={handleMouseLeave}
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
                  onError={handleImageError}
                  aria-label="Carte de France avec les villes d'intervention"
                />
              </Map>
            )}
          </MapContainer>
        </RightContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default Secteurs; 
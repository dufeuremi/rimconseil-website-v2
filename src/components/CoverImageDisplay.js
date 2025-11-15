import React from 'react';
import styled from 'styled-components';

const CoverImageContainer = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  position: relative;
`;

const CoverImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.01);
  }
  
  @media (max-width: 768px) {
    max-height: 250px;
    border-radius: 4px;
  }
`;

const CoverImageDisplay = ({ src, alt = "", className }) => {
  if (!src) return null;
  return (
    <CoverImageContainer className={className}>
      <CoverImage
        src={src}
        alt={alt}
        onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
    </CoverImageContainer>
  );
};

export default CoverImageDisplay; 
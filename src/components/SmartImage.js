import React, { useState } from 'react';
import { getDisplayImage, processImageUrl } from '../utils/imageUtils';

/**
 * Composant React pour affichage intelligent des images
 * Implémente la logique de fallback recommandée par la documentation backend
 */
function SmartImage({ 
  item, 
  alt, 
  className = "", 
  fallback = "/images/placeholder.jpg",
  preferCover = true,
  style = {}
}) {
  const imageSrc = getDisplayImage(item);
  return (
    <img
      src={imageSrc}
      alt={alt || item.titre || item.title || 'Image'}
      className={className}
      style={{ width: '100%', height: 'auto', objectFit: 'cover', ...style }}
      onError={e => { e.target.onerror = null; e.target.src = fallback; }}
    />
  );
}

export default SmartImage;
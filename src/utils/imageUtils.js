import { API_BASE_URL } from '../App';

/**
 * Fonction ESSENTIELLE pour déterminer quelle image afficher
 * Basée sur la documentation du backend
 * Priorité : cover_img_path → img_path → placeholder
 */
export function getDisplayImage(item) {
  // Priorité 1: Image de couverture (recommandée pour les listes)
  if (item.cover_img_path) {
    return processImageUrl(item.cover_img_path);
  }
  
  // Priorité 2: Image principale (fallback)
  if (item.img_path) {
    return processImageUrl(item.img_path);
  }
  
  // Fallback: Image placeholder
  return '/images/placeholder.jpg';
}

/**
 * Traite une URL d'image pour gérer les chemins relatifs et absolus
 */
export function processImageUrl(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return '';

  // Si c'est déjà une URL absolue ou Data URL, retourner tel quel
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Si le chemin contient 'uploads/' (avec ou sans slash initial), préfixer avec API_BASE_URL
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  if (imagePath.startsWith('uploads/')) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  if (imagePath.includes('uploads/')) {
    // Cas rare: chemin relatif style 'foo/uploads/bar.jpg'
    const idx = imagePath.indexOf('uploads/');
    return `${API_BASE_URL}/${imagePath.substring(idx)}`;
  }

  // Si ça commence par /, c'est relatif à la racine du domaine
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Sinon, c'est un chemin relatif, préfixer avec /images/
  return `/images/${imagePath}`;
}

/**
 * Fonction pour obtenir une image avec fallback automatique
 * Utilise cover_img_path en priorité, puis img_path
 */
export function getImageWithFallback(item, preferCover = true) {
  if (preferCover) {
    // Pour les listes d'articles : priorité à cover_img_path
    return item.cover_img_path || item.img_path || '';
  } else {
    // Pour le contenu détaillé : priorité à img_path
    return item.img_path || item.cover_img_path || '';
  }
}
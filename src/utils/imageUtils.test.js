/**
 * Tests pour les utilitaires d'images
 * Ce fichier peut être utilisé pour tester les fonctions dans la console du navigateur
 */

// Exemple d'article avec différents types d'images
const exempleArticle1 = {
  id: 1,
  titre: "Article avec cover_img_path",
  cover_img_path: "/uploads/coverImage-1763228534114-795577317",
  img_path: "/uploads/image-1763228534114-795577316"
};

const exempleArticle2 = {
  id: 2,
  titre: "Article avec seulement img_path",
  img_path: "/uploads/image-1763228534114-795577316"
};

const exempleArticle3 = {
  id: 3,
  titre: "Article avec image base64",
  img_path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."
};

const exempleArticle4 = {
  id: 4,
  titre: "Article sans image"
};

// Tests à exécuter dans la console du navigateur :
/*

// Importer les utilities
import { getDisplayImage, processImageUrl, getImageWithFallback } from './src/utils/imageUtils.js';

// Test 1: Article avec cover_img_path et img_path
console.log('Test 1:', getDisplayImage(exempleArticle1));
// Résultat attendu: "http://localhost:4000/uploads/coverImage-1763228534114-795577317"

// Test 2: Article avec seulement img_path
console.log('Test 2:', getDisplayImage(exempleArticle2));
// Résultat attendu: "http://localhost:4000/uploads/image-1763228534114-795577316"

// Test 3: Article avec image base64
console.log('Test 3:', getDisplayImage(exempleArticle3));
// Résultat attendu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."

// Test 4: Article sans image
console.log('Test 4:', getDisplayImage(exempleArticle4));
// Résultat attendu: "/images/placeholder.jpg"

// Test des URLs
console.log('URL absolue:', processImageUrl('http://example.com/image.jpg'));
console.log('Chemin uploads:', processImageUrl('/uploads/image-123.jpg'));
console.log('Chemin relatif:', processImageUrl('image.jpg'));

*/

export {
  exempleArticle1,
  exempleArticle2,
  exempleArticle3,
  exempleArticle4
};
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Mapping des routes vers les noms de pages
const pageTitles = {
  '/': 'Accueil',
  '/expertises': 'Expertises',
  '/services': 'Services',
  '/secteurs': 'Secteurs',
  '/valeurs': 'Valeurs',
  '/equipe': 'Notre Équipe',
  '/reseau': 'Notre Réseau',
  '/actualites': 'Actualités',
  '/contact': 'Contact',
  '/connexion': 'Connexion',
  '/rendez-vous': 'Rendez-vous',
  '/mentions-legales': 'Mentions légales',
  '/politique-confidentialite': 'Politique de confidentialité',
  '/dashboard': 'Dashboard',
  '/dashboard/pages': 'Dashboard - Pages',
  '/dashboard/articles': 'Dashboard - Articles',
  '/dashboard/expertises': 'Dashboard - Expertises',
  '/dashboard/services': 'Dashboard - Services',
  '/dashboard/secteurs': 'Dashboard - Secteurs',
  '/dashboard/valeurs': 'Dashboard - Valeurs',
  '/dashboard/actualites': 'Dashboard - Actualités',
  '/dashboard/contact': 'Dashboard - Contact'
};

const PageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Si on est sur la page d'accueil, on affiche seulement "Rim'conseil"
    if (location.pathname === '/') {
      document.title = "Rim'conseil";
    } else {
      // Sinon, on affiche "Nom de page - Rim'conseil"
      const pageTitle = pageTitles[location.pathname] || 'Page';
      document.title = `${pageTitle} - Rim'conseil`;
    }
  }, [location.pathname]);

  return null; // Ce composant ne rend rien dans le DOM
};

export default PageTitle; 
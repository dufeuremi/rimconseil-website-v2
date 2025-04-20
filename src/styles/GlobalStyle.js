import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme'; // Assurez-vous que le chemin est correct

// Fonction pour transformer les clés de thème en variables CSS
const generateCSSVariables = (themeObject, prefix = '--') => {
  let variables = '';
  for (const key in themeObject) {
    const value = themeObject[key];
    const cssKey = `${prefix}${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Pour les objets imbriqués (comme colors.gray), générer des variables avec tirets
      for (const subKey in value) {
        const subValue = value[subKey];
        const subCssKey = `${cssKey}-${subKey}`;
        variables += `${subCssKey}: ${subValue};\n`;
      }
    } else {
      variables += `${cssKey}: ${value};\n`;
    }
  }
  return variables;
};

const GlobalStyle = createGlobalStyle`
  :root {
    /* Générer les variables CSS à partir du thème */
    ${generateCSSVariables(theme.colors, '--color-')}
    ${generateCSSVariables(theme.typography.fontFamily, '--font-')}
    ${generateCSSVariables(theme.typography.fontSize, '--fs-')}
    ${generateCSSVariables(theme.typography.fontWeight, '--fw-')}
    ${generateCSSVariables(theme.typography.lineHeight, '--lh-')}
    ${generateCSSVariables(theme.spacing, '--space-')}
    ${generateCSSVariables(theme.breakpoints, '--bp-')}
    ${generateCSSVariables(theme.shadows, '--shadow-')}
    ${generateCSSVariables(theme.transitions, '--transition-')}
    ${generateCSSVariables(theme.rims, '--radius-')}
    ${generateCSSVariables(theme.zIndex, '--z-')}
    /* Ajoutez d'autres sections du thème si nécessaire */
    
    /* Styles globaux */
    --container-width: 1200px; 
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-primary);
    background-color: var(--color-background);
    color: var(--color-text);
    line-height: var(--lh-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-colors);
  }

  a:hover {
    color: var(--color-secondary); /* Ou une autre couleur de survol */
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 var(--space-4) 0;
    font-family: var(--font-secondary);
    color: var(--color-secondary);
    font-weight: var(--fw-bold);
    line-height: var(--lh-tight);
  }

  h1 { font-size: var(--fs-4xl); }
  h2 { font-size: var(--fs-3xl); }
  h3 { font-size: var(--fs-2xl); }
  h4 { font-size: var(--fs-xl); }
  h5 { font-size: var(--fs-lg); }
  h6 { font-size: var(--fs-base); }

  p {
    margin: 0 0 var(--space-4) 0;
  }

  ul, ol {
    margin: 0 0 var(--space-4) 0;
    padding-left: var(--space-5);
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
  
  .container {
    max-width: var(--container-width);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--space-4); /* 1rem */
    padding-right: var(--space-4); /* 1rem */
  }

  /* Autres styles globaux ou reset si nécessaire */
`;

export default GlobalStyle; 
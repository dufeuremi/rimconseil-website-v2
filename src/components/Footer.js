import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from '@phosphor-icons/react';
import './Footer.css';
import logoSrc from '../assets/images/logo.svg';
import styled from 'styled-components';

const FooterLogo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
`;

const LogoImage = styled.img`
  height: 28px;
  margin-right: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-secondary);
`;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo et description */}
          <div className="footer-brand">
            <div className="brand-header" style={{ textAlign: 'center' }}>
              <FooterLogo to="/" className="footer-logo">
                <LogoImage src={logoSrc} alt="Logo Rim Conseil" />
                <LogoText>
                  Rim'conseil
                </LogoText>
              </FooterLogo>
              <p className="brand-slogan">Piloter l'IT avec sens.</p>
            </div>
            <div className="eco-info">
              <p>
                <Leaf weight="fill" style={{ marginBottom: '-2px' }} />
                Site éco-conçu et hébergé en France. Site réalisé par <a href="https://www.linkedin.com/in/dufeuremi" target="_blank" rel="noopener noreferrer">Rémi Dufeu</a>
              </p>
            </div>
          </div>

          {/* Navigation - première colonne */}
          <div className="footer-nav-group">
            <h3>Navigation</h3>
            <nav className="footer-nav">
              <Link to="/" className="link">Accueil</Link>
              <Link to="/expertises" className="link">Expertises</Link>
              <Link to="/services" className="link">Services</Link>
              <Link to="/valeurs" className="link">Valeurs</Link>
              <Link to="/equipe" className="link">Équipe</Link>
            </nav>
          </div>

          {/* Navigation - deuxième colonne */}
          <div className="footer-nav-group">
            <nav className="footer-nav">
              <Link to="/reseau" className="link">Réseau</Link>
              <Link to="/articles" className="link">Articles</Link>
              <Link to="/actualites" className="link">Actualités</Link>
              <Link to="/contact" className="link">Contact</Link>
              <Link to="/dashboard" className="link">Dashboard</Link>
            </nav>
          </div>

          {/* Contact et réseaux sociaux */}
          <div className="footer-nav-group">
            <h3>Contact</h3>
            <nav className="footer-nav">
              <a href="mailto:info@rimconseil.fr" className="link">info@rimconseil.fr</a>
              <address className="footer-address">
                7 RUE GOUNOD<br />
                35000 RENNES
              </address>
            </nav>
          </div>
        </div>

        {/* Copyright et mentions légales */}
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Rim'conseil. Tous droits réservés.</p>
          <nav className="legal-nav">
            <Link to="/mentions-legales" className="link">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="link">Politique de confidentialité</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
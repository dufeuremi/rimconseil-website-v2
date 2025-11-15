import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { List, Leaf } from '@phosphor-icons/react';
import BurgerMenu from './BurgerMenu';
import logoSrc from '../assets/images/logo.svg';
import logoWhiteSrc from '../assets/images/logoWhite.svg';
import linkedinLogo from '../assets/images/linkedin.svg';

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ scrollProgress }) => 
    scrollProgress === 0 
      ? 'transparent' 
      : `rgba(255, 255, 255, ${Math.min(0.35, scrollProgress * 0.35)})`
  };
  backdrop-filter: ${({ scrollProgress }) => 
    scrollProgress === 0 
      ? 'none' 
      : `blur(${Math.min(20, scrollProgress * 20)}px)`
  };
  -webkit-backdrop-filter: ${({ scrollProgress }) => 
    scrollProgress === 0 
      ? 'none' 
      : `blur(${Math.min(20, scrollProgress * 20)}px)`
  };
  z-index: 100;
  transition: transform 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease;
  transform: translateY(${({ visible }) => (visible ? '0' : '-100%')});
  border-bottom: ${({ scrollProgress }) => 
    scrollProgress === 0 
      ? 'none' 
      : '1px solid rgba(229, 231, 235, 0.4)'
  };
`;

const HeaderContainer = styled.header`
  max-width: 1664px;
  margin: 0 auto;
  padding: 1.5rem 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem 0.5rem 0.5rem;
  border-radius: 32px;
  transition: box-shadow 0.2s;
  min-height: 36px;
  min-width: 90px;
  cursor: pointer;
  gap: 0.2rem;
  width: 100%;
  &:hover, &:focus {
    background: none;
    box-shadow: none;
    text-decoration: none;
  }
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;
  margin-right: 0.2rem;
  border-radius: 8px;
  background: none;
  transition: box-shadow 0.2s;
`;

const LogoText = styled.span`
  font-size: 1.32rem;
  font-weight: 600;
  color: ${({ transparent }) => transparent ? '#fff' : 'var(--color-secondary)'};
  letter-spacing: -0.5px;
  line-height: 1;
  transition: color 0.2s;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
`;

const LinkedInIcon = styled.a`
  margin-right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 0;
  border: none;
  background: none;
  color: ${({ transparent }) => transparent ? '#fff' : 'var(--color-primary-light)'};
  padding: 0;

  .linkedin-svg-mask {
    width: 18px;
    height: 18px;
    display: block;
    background: ${({ transparent }) => transparent ? '#fff' : 'linear-gradient(45deg, var(--color-primary), var(--color-primary-light))'};
    -webkit-mask-image: url(${linkedinLogo});
    mask-image: url(${linkedinLogo});
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-position: center;
    mask-position: center;
    background-color: ${({ transparent }) => transparent ? '#fff' : 'var(--color-primary)'};
    transition: background 0.3s;
  }
`;

const LeafIcon = styled.div`
  margin-right: 5px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    background: linear-gradient(45deg, var(--color-green) 0%, var(--color-mint) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${({ transparent }) => transparent ? '#fff' : '#1F2937'};
  height: 48px;
  width: 48px;
  margin: 0;
  
  &:hover {
    color: ${({ transparent }) => transparent ? '#fff' : '#3B82F6'};
  }
  
  svg {
    margin-top: 1px;
    font-weight: bold;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const prevScrollPos = useRef(window.pageYOffset);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transparent, setTransparent] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Calcul du backdrop blur progressif (0 à 1 sur la première moitié de l'écran)
      const blurProgress = Math.min(currentScrollPos / (windowHeight / 2), 1);
      setScrollProgress(blurProgress);

      // Transparence du texte/logo
      if (isHomePage) {
        setTransparent(blurProgress < 0.3);
      } else {
        setTransparent(false);
      }

      // Masquage/affichage au scroll (scroll down = masqué, scroll up = visible)
      if (currentScrollPos > 100) { // Commence à masquer après 100px
        if (currentScrollPos < prevScrollPos.current) {
          setVisible(true); // scroll up
        } else if (currentScrollPos > prevScrollPos.current) {
          setVisible(false); // scroll down
        }
      } else {
        setVisible(true); // Toujours visible en haut de page
      }
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  return (
    <>
      <HeaderWrapper visible={visible} scrollProgress={scrollProgress}>
        <HeaderContainer>
          <Logo to="/">
            <LogoImage src={transparent ? logoWhiteSrc : logoSrc} alt="Logo Rim Conseil" />
            {/* <LogoText transparent={transparent}>
              Rim'conseil
            </LogoText> */}
          </Logo>
          <HeaderActions>
            <LinkedInIcon
              href="https://www.linkedin.com/company/rimconseil/"
              target="_blank"
              rel="noopener noreferrer"
              transparent={transparent}
            >
              <span className="linkedin-svg-mask" />
            </LinkedInIcon>
            <MenuButton onClick={() => setIsMenuOpen(true)} transparent={transparent}>
              <List weight="bold" />
            </MenuButton>
          </HeaderActions>
        </HeaderContainer>
      </HeaderWrapper>

      <BurgerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Header; 
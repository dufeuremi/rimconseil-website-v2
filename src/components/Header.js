import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { List, Leaf } from '@phosphor-icons/react';
import BurgerMenu from './BurgerMenu';
import logoSrc from '../assets/images/logo.svg';
import logoWhiteSrc from '../assets/images/logoWhite.svg';
import linkedinLogo from '../assets/images/linkedin.svg';

const HeaderWrapper = styled.div`
  position: ${({ transparent }) => transparent ? 'fixed' : 'absolute'};
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ transparent }) => transparent ? 'transparent' : 'white'};
  z-index: 100;
  transition: transform 0.3s ease, background-color 0.3s ease, border-bottom 0.3s ease, margin-bottom 0.3s ease;
  transform: translateY(${({ visible }) => (visible ? '0' : '-100%')});
  border-bottom: ${({ transparent }) => transparent ? 'none' : '1px solid var(--color-quaternary, #E5E7EB)'};
  margin-bottom: ${({ transparent }) => transparent ? '0' : '2rem'};
  height: ${({ visible }) => (visible ? 'auto' : '0')};
  overflow: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const HeaderContainer = styled.header`
  max-width: 1280px;
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
`;

const LogoImage = styled.img`
  height: 28px;
  margin-right: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ transparent }) => transparent ? '#fff' : 'var(--color-secondary)'};
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
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrolledFullScreen, setScrolledFullScreen] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const halfWindowHeight = windowHeight / 2;

      // Transparence (uniquement sur la home)
      if (isHomePage) {
        if (currentScrollPos < halfWindowHeight) {
          setTransparent(true);
          document.querySelector('.main-content').classList.add('header-transparent');
        } else {
          setTransparent(false);
          document.querySelector('.main-content').classList.remove('header-transparent');
        }
      } else {
        setTransparent(false);
        document.querySelector('.main-content').classList.remove('header-transparent');
      }

      // Masquage/affichage (toutes pages)
      const isScrollingUp = prevScrollPos > currentScrollPos;
      if (currentScrollPos > windowHeight) {
        setVisible(isScrollingUp);
      } else {
        setVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, isHomePage]);

  return (
    <>
      <HeaderWrapper visible={visible} transparent={transparent}>
        <HeaderContainer>
          <Logo to="/">
            <LogoImage src={transparent ? logoWhiteSrc : logoSrc} alt="Logo Rim Conseil" />
            <LogoText transparent={transparent}>
              Rim'conseil
            </LogoText>
          </Logo>
          <HeaderActions>
            <LinkedInIcon
              href="https://www.linkedin.com/in/robin-jean-philippe/"
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
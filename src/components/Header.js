import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { List, Leaf } from '@phosphor-icons/react';
import { FaLinkedinIn } from 'react-icons/fa';
import BurgerMenu from './BurgerMenu';
import logoSrc from '../assets/images/logo.svg';

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 100;
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
  color: var(--color-secondary);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const LinkedInIcon = styled.a`
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: #0A66C2;
  transition: all 0.3s ease;
  border: 1px solid #0A66C2;
  background-color: transparent;
  
  &:hover {
    color: white;
    background-color: #0A66C2;
    transform: translateY(-2px);
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
  color: #1F2937;
  
  &:hover {
    color: #3B82F6;
  }
  
  svg {
    margin-top: 1px;
    font-weight: bold;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <Logo to="/">
            <LogoImage src={logoSrc} alt="Logo Rim Conseil" />
            <LogoText>
              Rim'conseil
            </LogoText>
          </Logo>
          <HeaderActions>
            <LinkedInIcon href="https://www.linkedin.com/company/rim-conseil" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn size={16} />
            </LinkedInIcon>
            <MenuButton onClick={() => setIsMenuOpen(true)}>
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
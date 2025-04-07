import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { X, CaretDown, CaretRight, ArrowRight } from '@phosphor-icons/react';

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease-in-out;
  z-index: 998;
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-320px'};
  width: 320px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 999;
  padding: 2rem;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const MenuList = styled.nav`
  margin-top: 3rem;
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 0.75rem 0;
  color: var(--color-secondary);
  text-decoration: none;
  font-weight: ${props => props.isMain ? '600' : '400'};
  font-size: ${props => props.isMain ? '1.1rem' : '1rem'};
  text-align: left;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const DropdownTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: var(--color-secondary);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  text-align: left;
  
  &:hover {
    color: var(--color-primary);
  }
  
  .icon {
    width: 1.2rem;
    height: 1.2rem;
    color: var(--color-tertiary);
    transition: color 0.3s ease;
  }
  
  &:hover .icon {
    color: var(--color-primary);
  }
`;

const DropdownContent = styled.div`
  padding-left: 1rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const SubMenuItem = styled(MenuItem)`
  padding-left: 0.5rem;
  font-style: normal;
  font-size: 1rem;
  color: var(--color-tertiary);
  font-weight: normal;
`;

const ContactButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, var(--color-primary) 0%, var(--color-primarylight) 100%);
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 0;
  text-align: left;
  transition: all 0.3s ease;
  width: 100%;
  
  .arrow-icon {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: white;
  }
  
  &:hover .arrow-icon {
    transform: translateX(4px);
  }
`;

const BurgerMenu = ({ isOpen, onClose }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuStructure = [
    {
      title: 'Accueil',
      path: '/',
      isDropdown: false
    },
    {
      title: 'Nos savoir-faire',
      isDropdown: true,
      items: [
        { title: 'Nos expertises', path: '/expertises' },
        { title: 'Nos services', path: '/services' }
      ]
    },
    {
      title: 'Qui sommes nous?',
      isDropdown: true,
      items: [
        { title: 'Nos valeurs', path: '/valeurs' },
        { title: 'Notre équipe', path: '/equipe' },
        { title: 'Notre réseau', path: '/reseau' }
      ]
    },
    {
      title: 'Articles',
      path: '/articles',
      isDropdown: false
    },
    {
      title: 'Actualités',
      path: '/actualites',
      isDropdown: false
    }
  ];

  return (
    <>
      <MenuOverlay isOpen={isOpen} onClick={onClose} />
      <MenuContainer isOpen={isOpen}>
        <CloseButton onClick={onClose}>
          <X weight="bold" />
        </CloseButton>
        <MenuList>
          {menuStructure.map((item, index) => (
            <div key={index}>
              {!item.isDropdown ? (
                <MenuItem to={item.path} isMain onClick={onClose}>
                  {item.title}
                </MenuItem>
              ) : (
                <>
                  <DropdownTitle onClick={() => toggleDropdown(index)}>
                    {item.title}
                    {activeDropdown === index ? 
                      <CaretDown className="icon" weight="bold" /> : 
                      <CaretRight className="icon" weight="bold" />
                    }
                  </DropdownTitle>
                  <DropdownContent isOpen={activeDropdown === index}>
                    {item.items.map((subItem, subIndex) => (
                      <SubMenuItem
                        key={subIndex}
                        to={subItem.path}
                        onClick={onClose}
                      >
                        {subItem.title}
                      </SubMenuItem>
                    ))}
                  </DropdownContent>
                </>
              )}
            </div>
          ))}
        </MenuList>
        <ContactButton to="/contact" onClick={onClose}>
          <span>Contactez nous</span>
          <ArrowRight className="arrow-icon" weight="bold" />
        </ContactButton>
      </MenuContainer>
    </>
  );
};

export default BurgerMenu; 
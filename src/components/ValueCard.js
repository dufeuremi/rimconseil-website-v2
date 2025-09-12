import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import { RiArrowRightLine } from 'react-icons/ri';
import Button from './Button';
import { Link } from 'react-router-dom';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(to bottom, transparent, #F4F9FF);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  // height: 100%;
`;

const IconContainer = styled.div`
  margin-bottom: 1.5rem;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    if (props.type === 'social') return 'var(--color-primarylight)';
    if (props.type === 'eco') return 'var(--color-green)';
    if (props.type === 'innovation') return 'var(--color-taupe)';
    return 'var(--color-quaternary)';
  }};
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 4px;
`;

const Title = styled.h3`
  color: var(--color-secondary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;
  width: 100%;
`;

const ListItem = styled.li`
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.5;

  &:before {
    content: attr(data-number);
    position: absolute;
    left: 0;
    color: var(--color-primary);
  }

  &:empty {
    display: none;
  }
`;

const ParagraphContainer = styled.div`
  text-align: left;
  width: 100%;
`;

const Paragraph = styled.p`
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  padding: 0;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ValueCard = ({ title, lottieFile, iconAlt, items, paragraph, hideDiscoverButton = false, classNamePrefix = '', renderTitle, renderItem, renderParagraph }) => {
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef(null);
  
  useEffect(() => {
    if (!lottieRef.current || !lottieRef.current.animationItem) return;
    
    const anim = lottieRef.current.animationItem;
    
    if (isHovered) {
      anim.setDirection(1);
      anim.setSpeed(2.5);
      anim.play();
    } else {
      anim.setDirection(-1);
      anim.setSpeed(3);
      anim.play();
    }
  }, [isHovered]);

  const getNumberSymbol = (index) => {
    return '»';
  };
  
  const getCardType = () => {
    if ((title || '').toLowerCase().includes('social')) return 'social';
    if ((title || '').toLowerCase().includes('écolo')) return 'eco';
    if ((title || '').toLowerCase().includes('innov')) return 'innovation';
    return 'default';
  };

  const cardType = getCardType();

  const defaultTitleEl = (
    <Title className={`${classNamePrefix ? classNamePrefix + '-title' : ''}`}>{title}</Title>
  );

  return (
    <CardContainer 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconContainer>
        {lottieFile ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={lottieFile}
            loop={false}
            autoplay={false}
            style={{ 
              width: '120%',
              height: '120%',
              transform: 'scale(1.2)',
              transformOrigin: 'center center'
            }}
          />
        ) : (
          <IconFallback type={cardType}>
            {cardType === 'social' && 'S'}
            {cardType === 'eco' && 'E'}
            {cardType === 'innovation' && 'I'}
          </IconFallback>
        )}
      </IconContainer>

      {typeof renderTitle === 'function' ? renderTitle(defaultTitleEl) : defaultTitleEl}

      {paragraph ? (
        <ParagraphContainer>
          {typeof renderParagraph === 'function' ? (
            renderParagraph(
              <Paragraph className={`${classNamePrefix ? classNamePrefix + '-paragraph' : ''}`}>
                {paragraph}
              </Paragraph>
            )
          ) : (
            <Paragraph className={`${classNamePrefix ? classNamePrefix + '-paragraph' : ''}`}>
              {paragraph}
            </Paragraph>
          )}
        </ParagraphContainer>
      ) : (
        <ListContainer>
          {items.map((item, index) => {
            const defaultItemEl = (
              <ListItem key={index} className={`${classNamePrefix ? classNamePrefix + '-item-' + index : ''}`} data-number={getNumberSymbol(index)}>
                {item}
              </ListItem>
            );
            return typeof renderItem === 'function' ? renderItem(defaultItemEl, index) : defaultItemEl;
          })}
        </ListContainer>
      )}

      {!hideDiscoverButton && (
        <ButtonContainer>
          <Button arrow={true} as={Link} to="/valeurs">
            Découvrir
          </Button>
        </ButtonContainer>
      )}
    </CardContainer>
  );
};

export default ValueCard; 
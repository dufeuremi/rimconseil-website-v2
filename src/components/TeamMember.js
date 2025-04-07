import React from 'react';
import styled from 'styled-components';
import { RiLinkedinBoxFill, RiPhoneFill, RiMailFill, RiMapPin2Fill } from 'react-icons/ri';
import Text from './Text';

const MemberCard = styled.div`
  display: flex;
  gap: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ProfileImageContainer = styled.div`
  flex: 0 0 auto;
  width: 250px;
  height: 250px;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const ProfileImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-quaternary);
  color: var(--color-tertiary);
  font-weight: 600;
  text-align: center;
  padding: 1rem;
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.h2`
  font-size: 2rem;
  color: var(--color-secondary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const MemberRole = styled.h3`
  font-size: 1.25rem;
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 2.5rem;
  text-align: left;
`;

const MemberBio = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  text-align: left;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--color-tertiary);
  
  svg {
    color: var(--color-primary);
    font-size: 1.2rem;
  }
  
  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--color-primary);
    }
  }
`;

const TeamMember = ({ 
  name, 
  role, 
  bio, 
  email, 
  phone, 
  linkedin, 
  location,
  image
}) => {
  return (
    <MemberCard>
      <ProfileImageContainer>
        {image ? (
          <ProfileImage 
            src={image} 
            alt={name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <ProfileImageFallback style={image ? {display: 'none'} : {}}>
          {name}
        </ProfileImageFallback>
      </ProfileImageContainer>
      
      <MemberInfo>
        <MemberName>{name}</MemberName>
        <MemberRole>{role}</MemberRole>
        
        <MemberBio>
          {typeof bio === 'string' ? (
            <Text variant="body">{bio}</Text>
          ) : (
            bio.map((paragraph, index) => (
              <Text variant="body" key={index}>{paragraph}</Text>
            ))
          )}
        </MemberBio>
        
        <ContactInfo>
          {email && (
            <ContactItem>
              <RiMailFill />
              <a href={`mailto:${email}`}>{email}</a>
            </ContactItem>
          )}
          
          {phone && (
            <ContactItem>
              <RiPhoneFill />
              <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
            </ContactItem>
          )}
          
          {linkedin && (
            <ContactItem>
              <RiLinkedinBoxFill />
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                Linkedin
              </a>
            </ContactItem>
          )}
          
          {location && (
            <ContactItem>
              <RiMapPin2Fill />
              <span>{location}</span>
            </ContactItem>
          )}
        </ContactInfo>
      </MemberInfo>
    </MemberCard>
  );
};

export default TeamMember; 
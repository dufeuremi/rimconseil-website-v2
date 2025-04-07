import React from 'react';
import styled from 'styled-components';

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
`;

const Label = styled.label`
  color: var(--color-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
`;

const StyledTextarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-quaternary);
  border-radius: 0;
  font-size: 0.875rem;
  color: var(--color-text);
  min-height: 150px;
  resize: vertical;
  transition: all 0.2s ease;
  text-align: left;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(44, 119, 227, 0.1);
  }

  &::placeholder {
    color: var(--color-tertiary);
    text-align: left;
  }
`;

const Textarea = ({ label, name, value, onChange, required = false, placeholder }) => {
  return (
    <TextareaWrapper>
      <Label htmlFor={name}>{label}</Label>
      <StyledTextarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </TextareaWrapper>
  );
};

export default Textarea; 
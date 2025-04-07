import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
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

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-quaternary);
  border-radius: 0;
  font-size: 0.875rem;
  color: var(--color-text);
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

const Input = ({ label, type = 'text', name, value, onChange, required = false, placeholder }) => {
  return (
    <InputWrapper>
      <Label htmlFor={name}>{label}</Label>
      <StyledInput
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </InputWrapper>
  );
};

export default Input; 
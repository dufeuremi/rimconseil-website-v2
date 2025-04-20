import React from 'react';
import styled from 'styled-components';

const MaintenanceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
`;

const Message = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const Maintenance = () => {
  return (
    <MaintenanceContainer>
      <Message>Site en maintenance. </Message>
      
    </MaintenanceContainer>
  );
};

export default Maintenance; 
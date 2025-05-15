import React from 'react';
import styled from 'styled-components';

const MaintenanceContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(248, 249, 250, 0.95);
  z-index: 1000;
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
import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { spacingXL } from '../styling/StylingConstants';

const PageLayout = styled.div`
    margin: ${spacingXL};
    width: 100%;
    display: flex;
    flex-direction: column;
`;

// Routes will be put in this
export const PageContent = () => {
  return <PageLayout>
    <Outlet />
  </PageLayout>;
};
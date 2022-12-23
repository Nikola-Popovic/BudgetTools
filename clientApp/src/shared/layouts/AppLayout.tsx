import React from 'react';
import { AppBar, APP_BAR_HEIGHT } from './AppBar';
import styled from 'styled-components';
import { PageContent } from './PageContent';
import { NavBar } from './NavBar';

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - ${APP_BAR_HEIGHT});
`;

export function AppLayout() {
  const [isNavBarVisible, setIsNavBarVisible] = React.useState(true);
  return (
    <div className="App">
      <AppBar onClick={() => setIsNavBarVisible(!isNavBarVisible)}></AppBar>
      <NavBar isVisible={isNavBarVisible}></NavBar>
      <AppContainer>
        <PageContent></PageContent>
      </AppContainer>
    </div>
  );
}

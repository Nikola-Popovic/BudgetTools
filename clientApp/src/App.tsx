import React from 'react';
import './App.css';
import { AppBar, APP_BAR_HEIGHT } from './shared/layouts/AppBar';
import styled from 'styled-components';
import { PageContent } from './shared/layouts/PageContent';
import { NavBar } from './shared/layouts/NavBar';

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - ${APP_BAR_HEIGHT});
`;

function App() {
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

export default App;

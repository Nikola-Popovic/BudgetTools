import React from 'react';
import './App.css';
import { AppBar, APP_BAR_HEIGHT } from './shared/layouts/AppBar';
import styled from 'styled-components';
import { PageContent } from './shared/layouts/PageContent';

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - ${APP_BAR_HEIGHT});
`;

function App() {
  return (
    <div className="App">
      <AppBar></AppBar>
      <AppContainer>
        <PageContent></PageContent>
      </AppContainer>
    </div>
  );
}

export default App;

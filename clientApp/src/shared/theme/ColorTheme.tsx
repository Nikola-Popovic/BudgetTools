import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ColorConstants } from '../styling/ColorConstants';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: ColorConstants.Primary,
    },
    secondary: {
      // This is green.A700 as hex.
      main: ColorConstants.PrimaryAccent,
    },
  },
});

type ChildrenProps = {
    children?: React.ReactNode;
};

const ColorThemeProvider: React.FC<{children?: React.ReactNode}> = ({children}: ChildrenProps) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

export default ColorThemeProvider;
import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor from './Editor';
import Container from '@material-ui/core/Container';
import TopControls from './controls/TopControls';
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import Header from './Header';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00adb5',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#f0ece2',
    padding: '1rem 1rem 1rem 1rem',
    // minHeight: '80vh',
  },
}));

export default function Layout() {
  const classes = useStyles();
  return (
    <div style={{ backgroundColor: '#393e46' }}>
      <ThemeProvider theme={theme}>
        {/* <Header /> */}
        <TopControls />
        <Container maxWidth="md" className={classes.container}>
          <Editor />
        </Container>
      </ThemeProvider>
    </div>
  );
}

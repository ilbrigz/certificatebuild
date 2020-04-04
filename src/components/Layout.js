import React from 'react';
import Editor from './Editor';
import Container from '@material-ui/core/Container';
import TopControls from './controls/TopControls';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../theme';

import Drawer from './Drawer';
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#16171B',
    padding: '0 1rem',
  },
}));

export default function Layout() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#2B2C30' }}>
        {/* <Header /> */}
        <TopControls />
        <Container maxWidth="md" className={classes.container}>
          <Editor />
        </Container>
        <Drawer />
      </div>
    </ThemeProvider>
  );
}

import React, { useRef, useEffect, useState, useMemo } from 'react';
import Layout from './components/Layout';

import { AppContextProvider } from './context';

export default function App() {
  console.log('App render');
  useEffect(() => {
    console.log('running app');
  }, []);
  return (
    <AppContextProvider>
      <Layout />
    </AppContextProvider>
  );
}

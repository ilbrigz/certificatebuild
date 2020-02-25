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
      <p className="normal">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
      <p className="bold">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
      <p className="normal">the quick brown fox jumps over the lazy dog</p>
      <p className="bold">the quick brown fox jumps over the lazy dog</p>
      <Layout />
    </AppContextProvider>
  );
}

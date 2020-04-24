import React from 'react';
import './App.css';
import theme from './theme';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;

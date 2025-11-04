/**
 * Main entry point for the CSSWindify Web application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <Layout />
    </AppProvider>
  </React.StrictMode>
);

/**
 * Main entry point for the CSSWindify Web application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Home } from './pages/Home';
import { Converter } from './pages/Converter';
import { Examples } from './pages/Examples';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/examples" element={<Examples />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

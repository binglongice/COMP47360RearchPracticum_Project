import React from 'react';
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {
    scope: "/"
  }
  )
    .then(registration => {
      console.log('Service worker registered:', registration);
    })
    .catch(error => {
      console.error('Service worker registration failed:', error);
    });
}


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("DeeMech: Initializing application...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("DeeMech: Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

// Register Service Worker for Mobile Installation
const registerServiceWorker = () => {
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    console.log('DeeMech: Skipping Service Worker registration on localhost');
    return;
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js?v=2.0')
      .then(reg => {
        console.log('DeeMech: Service Worker Registered', reg.scope);
        // Check for updates every 1 hour
        setInterval(() => {
          reg.update();
        }, 1000 * 60 * 60);
      })
      .catch(err => console.log('DeeMech: SW Registration Failed', err));
  }
};

if (document.readyState === 'complete') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}

try {
  console.log("DeeMech: Creating React root...");
  const root = ReactDOM.createRoot(rootElement);
  console.log("DeeMech: Rendering App...");
  
  // Safety timeout to detect if mounting hangs
  const mountTimeout = setTimeout(() => {
    console.error("DeeMech: Mounting is taking unusually long. Still stuck on loading?");
  }, 5000);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Cleanup loading screen manually just in case
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.5s ease';
      setTimeout(() => loadingScreen.remove(), 500);
    }
  }, 100);
  
  clearTimeout(mountTimeout);
  console.log("DeeMech: Render call complete.");
} catch (error) {
  console.error("DeeMech: Critical mounting error:", error);
  rootElement.innerHTML = `<div style="padding: 20px; color: #ef4444; font-family: sans-serif;">
    <h1 style="font-size: 16px; font-weight: bold;">Critical Error</h1>
    <p style="font-size: 12px;">Failed to mount application. Please check console for details.</p>
  </div>`;
}

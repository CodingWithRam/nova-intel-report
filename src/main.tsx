import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker for offline caching and instant reload on update
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, auto-updating...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('Nova Intel Report is now available offline!');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

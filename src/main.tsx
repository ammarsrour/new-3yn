import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import './index.css';

// Set initial direction based on browser language
const browserLang = navigator.language.split('-')[0];
const savedLang = localStorage.getItem('i18nextLng');
const initialLang = savedLang || browserLang;

if (initialLang === 'ar') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
  document.body.style.fontFamily = '"Cairo", "Tajawal", "Amiri", "Noto Sans Arabic", sans-serif';
} else {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
  document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

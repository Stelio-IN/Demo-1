import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* FIX: Explicitly pass the `App` component as the `children` prop to `LanguageProvider` to resolve a TypeScript error where the `children` prop was not being correctly inferred from the JSX syntax. */}
    <LanguageProvider children={<App />} />
  </React.StrictMode>
);
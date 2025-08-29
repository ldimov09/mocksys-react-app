import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './main.css'
import { AlertProvider } from './contexts/AlertContext';
import theme from './theme';
import { ThemeProvider } from '@emotion/react';
import { ValidationProvider } from './contexts/ValidationContext';
import { TranslationProvider } from './contexts/TranslationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TranslationProvider>
      <AlertProvider>
        <AuthProvider>
          <ValidationProvider>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </ValidationProvider>
        </AuthProvider>
      </AlertProvider>
    </TranslationProvider>
  </React.StrictMode>
);

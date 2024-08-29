import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './azure/AuthConfig';
// Tworzenie instancji PublicClientApplication
const pca = new PublicClientApplication(msalConfig);

// Utworzenie korzenia aplikacji
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderowanie aplikacji
root.render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>
);

// Jeśli chcesz mierzyć wydajność swojej aplikacji, przekaż funkcję
// do logowania wyników (na przykład: reportWebVitals(console.log))
// lub wyślij do punktu końcowego analityki. Dowiedz się więcej: https://bit.ly/CRA-vitals
reportWebVitals();
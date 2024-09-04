import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderowanie aplikacji
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
  </React.StrictMode>
);

// Jeśli chcesz mierzyć wydajność swojej aplikacji, przekaż funkcję
// do logowania wyników (na przykład: reportWebVitals(console.log))
// lub wyślij do punktu końcowego analityki. Dowiedz się więcej: https://bit.ly/CRA-vitals
reportWebVitals();
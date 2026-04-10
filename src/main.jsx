import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom"; 
import { UserProvider } from './context/UserContext.jsx'; // <-- import UserProvider

window.__reactRouterExperimental__ = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
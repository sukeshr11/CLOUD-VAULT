import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import ContactsDemo from './pages/ContactsDemo';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN?.trim();
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.trim();
const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

if (!domain || !clientId || !audience) {
  root.render(
    <React.StrictMode><ContactsDemo /></React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: audience,
        }}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
}

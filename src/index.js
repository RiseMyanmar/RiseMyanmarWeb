import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import this

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter> {/* ✅ Wrap everything inside BrowserRouter */}
    <Auth0Provider
      domain="dev-qlujaq14vw65tmsy.us.auth0.com"
      clientId="nqc3hcpUxToxNR9AehM1sJVEeQzXOtgA"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);

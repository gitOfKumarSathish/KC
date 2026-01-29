import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import keycloak from './keycloak';

const root = createRoot(document.getElementById('root'));

// Init Keycloak BEFORE rendering React
keycloak.init({ onLoad: 'login-required' })
  .then((authenticated) => {
    if (authenticated) {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    } else {
      // This case generally won't happen with 'login-required'
      // as it would have redirected.
      console.warn("Not authenticated");
    }
  })
  .catch(console.error);

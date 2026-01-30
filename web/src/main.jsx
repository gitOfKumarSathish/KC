import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import keycloak from './keycloak';
import LoginPage from './LoginPage.jsx';

const root = createRoot(document.getElementById('root'));

// Init Keycloak BEFORE rendering React
keycloak.init({ onLoad: 'check-sso' })
  .then((authenticated) => {
    if (authenticated) {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    } else {
      root.render(
        <StrictMode>
          <LoginPage
            onLogin={() => keycloak.login()}
            onGithubLogin={() => keycloak.login({ idpHint: 'github' })}
          />
        </StrictMode>
      );
    }
  })
  .catch(console.error);

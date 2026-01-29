import { useState, useEffect, useRef } from 'react';
import keycloak from './keycloak';
import Dashboard from './Dashboard';

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // We are already authenticated at this point (handled in main.jsx)
    // Just load the profile
    keycloak.loadUserProfile()
      .then(profile => {
        setUserProfile(profile);
      })
      .catch(err => {
        console.error("Failed to load user profile", err);
      });

  }, []);

  const logout = () => {
    keycloak.logout();
  };

  // No loading state needed - we are IN.
  return (
    <Dashboard
      userProfile={userProfile}
      logout={logout}
      keycloakToken={keycloak.token}
    />
  );
}

export default App;

import keycloak from './keycloak';

/**
 * A wrapper around fetch that ensures the Keycloak token is valid.
 * It attempts to update the token (if it expires in < 30 seconds) before making the request.
 */
export const authorizedFetch = async (url, options = {}) => {
    try {
        // 1. Check and Refresh Token
        // updateToken(30) means: "If token expires in less than 30s, refresh it now."
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
            console.log('Token was successfully refreshed');
        }
    } catch (error) {
        console.error('Failed to refresh token', error);
        // If refresh fails (e.g. session expired), redirect to login
        keycloak.login();
        return; // Stop execution
    }

    // 2. Add Authorization Header
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type': 'application/json' // Default to JSON, can be overridden
    };

    // 3. Perform the actual Fetch
    return fetch(url, { ...options, headers });
};

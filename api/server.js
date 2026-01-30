const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configure Session (Required by Keycloak)
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'some-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Configure Keycloak
// We will look for keycloak.json later or configure it inline
const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": process.env.KEYCLOAK_REALM,
  "auth-server-url": process.env.KEYCLOAK_AUTH_SERVER_URL,
  "ssl-required": "external",
  "resource": process.env.KEYCLOAK_RESOURCE,
  "bearer-only": true,
  "confidential-port": 0
});

app.use(keycloak.middleware());

// Helper Middleware to check for Roles
const checkRoles = (allowedRoles) => (req, res, next) => {
  const token = req.kauth.grant.access_token;
  // check if user has ANY of the allowed roles
  const hasPermission = allowedRoles.some(role => token.hasRealmRole(role));

  if (hasPermission) {
    next();
  } else {
    res.status(403).json({ error: "Access Denied: Insufficient Permissions" });
  }
}

// Public Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Public API!' });
});

// Protected Route - Only authenticated users can access
app.get('/api/protected', keycloak.protect(), (req, res) => {
  // Access user information from the token
  const content = req.kauth.grant.access_token.content;
  res.json({
    message: 'This is a PROTECTED resource.',
    user: content.preferred_username,
    full_content: content
  });
});

// Initialize Keycloak Admin Client Helper
// We use dynamic import because @keycloak/keycloak-admin-client is ESM
async function getAdminClient() {
  const { default: KeycloakAdminClient } = await import('@keycloak/keycloak-admin-client');
  const kcAdminClient = new KeycloakAdminClient({
    baseUrl: 'http://localhost:8080', // Admin often runs on same base URL
    realmName: process.env.KEYCLOAK_REALM,
  });

  await kcAdminClient.auth({
    grantType: 'client_credentials',
    clientId: process.env.KEYCLOAK_BACKEND_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  });

  return kcAdminClient;
}

// 1. LIST USERS Route
app.get('/api/users', keycloak.protect(), async (req, res) => {
  try {
    const adminClient = await getAdminClient();
    const users = await adminClient.users.find();

    // Fetch roles for each user (N+1, but acceptable for this scale)
    const usersWithRoles = await Promise.all(users.map(async (user) => {
      try {
        // Use Composite mappings to get effective roles (including inherited ones)
        const roleMappings = await adminClient.users.listCompositeRealmRoleMappings({ id: user.id });

        // Filter strictly for business roles (Admin, Manager) - Standard is implied by absence
        const roleNames = roleMappings.map(r => r.name).filter(n => ['admin', 'manager'].includes(n));
        return { ...user, roles: roleNames };
      } catch (err) {
        console.error(`Failed to fetch roles for user ${user.username}`, err);
        return { ...user, roles: [] };
      }
    }));

    res.json(usersWithRoles);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 2. CREATE USER Route (Protected - ADMIN Only)
app.post('/api/users', keycloak.protect(), checkRoles(['admin']), express.json(), async (req, res) => {
  try {
    const adminClient = await getAdminClient();
    const { username, email, firstName, lastName, phoneNumber, role, sendInvitation } = req.body;

    // 1. Prepare User Payload
    const userPayload = {
      username,
      email,
      firstName,
      lastName,
      enabled: true,
      emailVerified: false, // They will verify via the email link
      attributes: {
        phoneNumber: [phoneNumber]
      }
    };

    // If NOT sending invitation, set a default password (Legacy behavior)
    if (!sendInvitation) {
      userPayload.credentials = [{
        type: 'password',
        value: 'password', // Default password
        temporary: true
      }];
      userPayload.emailVerified = true; // Assume verified if we set password manually
    }

    // 2. Create the User
    const newUser = await adminClient.users.create(userPayload);

    // 3. Assign Role (if provided)
    if (role && role !== 'standard') {
      const roleObject = await adminClient.roles.findOneByName({ name: role });
      if (roleObject) {
        await adminClient.users.addRealmRoleMappings({
          id: newUser.id,
          roles: [{
            id: roleObject.id,
            name: roleObject.name
          }]
        });
        console.log(`Assigned role ${role} to user ${username}`);
      }
    }

    // 4. Send Invitation Email (if requested)
    if (sendInvitation) {
      try {
        await adminClient.users.executeActionsEmail({
          id: newUser.id,
          actions: ['UPDATE_PASSWORD', 'VERIFY_EMAIL']
        });
        console.log(`Invitation email sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send invitation email", emailError);
        // We don't fail the whole request, but we warn
        return res.status(201).json({ ...newUser, warning: "User created, but Email failed." });
      }
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user", error);

    // Check for "User already exists" (409 Conflict)
    if (error.response && error.response.status === 409) {
      return res.status(409).json({ error: "User with this username or email already exists." });
    }

    // Return actual error message for debugging
    res.status(500).json({
      error: "Failed to create user: " + (error.response?.data?.errorMessage || error.message)
    });
  }
});

// 3. DELETE USER Route (Protected - ADMIN or MANAGER)
app.delete('/api/users/:id', keycloak.protect(), checkRoles(['admin', 'manager']), async (req, res) => {
  try {
    const adminClient = await getAdminClient();
    await adminClient.users.del({ id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 4. UPDATE PASSWORD Route (Protected - Self Service)
app.put('/api/update-password', keycloak.protect(), express.json(), async (req, res) => {
  try {
    const { newPassword, currentPassword } = req.body;
    // Get the User ID from the Token (The "sub" claim is the UUID)
    const userId = req.kauth.grant.access_token.content.sub;
    // We also need the username to verify the old password
    const username = req.kauth.grant.access_token.content.preferred_username;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }
    if (!currentPassword) {
      return res.status(400).json({ error: "Current Password is required" });
    }

    // --- VERIFY CURRENT PASSWORD ---
    // We try to "Login" with the current credentials to see if they are valid.
    const verificationUrl = 'http://localhost:8080/realms/learning-realm/protocol/openid-connect/token';
    const params = new URLSearchParams();
    params.append('client_id', 'learning-client'); // Public client
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', currentPassword);

    const verifyResponse = await fetch(verificationUrl, {
      method: 'POST',
      body: params
    });

    if (!verifyResponse.ok) {
      return res.status(401).json({ error: "Incorrect Current Password" });
    }
    // -------------------------------

    const adminClient = await getAdminClient();

    await adminClient.users.resetPassword({
      id: userId,
      credential: {
        type: 'password',
        value: newPassword,
        temporary: false // User is setting it themselves, so it's not temporary
      }
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// 5. ADMIN TRIGGER RESET PASSWORD (Email)
app.put('/api/users/:id/reset-password', keycloak.protect(), checkRoles(['admin']), async (req, res) => {
  try {
    const adminClient = await getAdminClient();

    // Triggers an email to the user with a link to update their password
    await adminClient.users.executeActionsEmail({
      id: req.params.id,
      actions: ['UPDATE_PASSWORD']
    });

    res.json({ message: "Password reset email trigger sent" });
  } catch (error) {
    console.error("Error sending reset email", error);

    // Keycloak throws an error if SMTP is not configured, BUT it might have still set the action.
    // Or it might have failed completely. 
    // We will return a helpful message to the Frontend.
    if (error.response && (error.response.status === 500 || error.message.includes('Failed to send execute actions email'))) {
      return res.status(200).json({
        message: "Reset initiated, but Email failed to send (SMTP missing in Keycloak). This is expected in Dev."
      });
    }

    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// 6. MFA STATUS (GET & TOGGLE)
app.get('/api/users/me/mfa-status', keycloak.protect(), async (req, res) => {
  try {
    const adminClient = await getAdminClient();
    const userId = req.kauth.grant.access_token.content.sub;

    // 1. Check if user has OTP credential configured
    const credentials = await adminClient.users.getCredentials({ id: userId });
    const hasOTP = credentials.some(cred => cred.type === 'otp');

    res.json({ enabled: hasOTP });
  } catch (error) {
    console.error("Error checking MFA status", error);
    res.status(500).json({ error: "Failed to check MFA status" });
  }
});

app.put('/api/users/me/mfa-status', keycloak.protect(), express.json(), async (req, res) => {
  try {
    const adminClient = await getAdminClient();
    const userId = req.kauth.grant.access_token.content.sub;
    const { enable } = req.body;

    if (enable) {
      // ENABLE: Add 'CONFIGURE_TOTP' to required actions
      // This forces the user to setup OTP on next login
      const user = await adminClient.users.findOne({ id: userId });
      const currentActions = user.requiredActions || [];

      if (!currentActions.includes('CONFIGURE_TOTP')) {
        await adminClient.users.update({ id: userId }, {
          requiredActions: [...currentActions, 'CONFIGURE_TOTP']
        });
      }
      res.json({ message: "MFA Setup Initiated. Logout and Login to configure." });

    } else {
      // DISABLE: Find and Delete ALL OTP credentials (Clean Slate)
      const credentials = await adminClient.users.getCredentials({ id: userId });
      const otpCredentials = credentials.filter(cred => cred.type === 'otp');

      // Delete all found OTP credentials
      for (const cred of otpCredentials) {
        await adminClient.users.deleteCredential({ id: userId, credentialId: cred.id });
      }

      // Also remove the required action if they haven't set it up yet
      const user = await adminClient.users.findOne({ id: userId });
      if (user.requiredActions && user.requiredActions.includes('CONFIGURE_TOTP')) {
        const newActions = user.requiredActions.filter(a => a !== 'CONFIGURE_TOTP');
        await adminClient.users.update({ id: userId }, { requiredActions: newActions });
      }

      res.json({ message: "MFA Disabled." });
    }

  } catch (error) {
    console.error("Error toggling MFA", error);
    // Return detailed error for frontend debugging
    const errorMessage = error.response ? (error.response.data?.errorMessage || error.message) : error.message;
    res.status(500).json({ error: "Failed to update MFA status: " + errorMessage });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

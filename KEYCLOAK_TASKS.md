# 📋 Keycloak Implementation Roadmap (Orchestration)

This checklist outlines the chronological steps to build a complete Enterprise Identity System using Keycloak, React, and Node.js. Use this to track your deployment progress.

---

## 🏗️ Phase 1: Environment Setup

- [ ] **Prerequisites**
  - [ ] Install Java JDK 17+ (`java -version`)
  - [ ] Install Node.js v18+ (`node -v`)
- [ ] **Keycloak Installation**
  - [ ] Download Keycloak Server (ZIP)
  - [ ] Extract to `keycloak-xx.x.x` folder
  - [ ] Start in Dev Mode (`kc.bat start-dev`)
  - [ ] Verify Access: `http://localhost:8080`

## ⚙️ Phase 2: Keycloak Configuration (The "Realm")

- [ ] **Realm Setup**
  - [ ] Login to Admin Console (admin/admin)
  - [ ] Create Realm: `learning-realm`
- [ ] **Client Setup**
  - [ ] Create Frontend Client (`learning-client`)
    - [ ] Type: Public (No Client Secret)
    - [ ] Redirect URI: `http://localhost:5173/*`
  - [ ] Create Backend Client (`backend-client`)
    - [ ] Type: Confidential (Has Client Secret)
    - [ ] Service Accounts: Enabled
  - [ ] **CRITICAL**: Assign `realm-admin` (or `view-realm` + `manage-users`) to `backend-client` Service Account Roles
- [ ] **Test Data**
  - [ ] Create a dummy user (`testuser`)
  - [ ] Set a password for `testuser`

## 🛡️ Phase 3: Backend Implementation (Node.js/Express)

- [ ] **Project Init**
  - [ ] `npm init -y` inside `api/`
  - [ ] Install: `express`, `keycloak-connect`, `express-session`, `cors`, `dotenv`
- [ ] **Security Configuration**
  - [ ] Create `.env` file with `KEYCLOAK_CLIENT_SECRET`
  - [ ] Configure `keycloak-connect` middleware
  - [ ] Setup `express-session` (MemoryStore)
- [ ] **Endpoints**
  - [ ] Create Public Route (`/`)
  - [ ] Create Protected Route (`/api/protected`)
  - [ ] Verify 403 Forbidden for unauthenticated requests

## 🎨 Phase 4: Frontend Implementation (React)

- [ ] **Project Init**
  - [ ] `npm create vite@latest web`
  - [ ] Install: `keycloak-js`
- [ ] **Auth Integration**
  - [ ] Create `keycloak.js` config
  - [ ] Initialize Keycloak in `main.jsx` (`onLoad: login-required`)
  - [ ] Add `Logout` button
- [ ] **API Connection**
  - [ ] Create `authorizedFetch` wrapper (Automatic Token Attach)
  - [ ] Call Backend Protected Route and display data

## 🔐 Phase 5: Role Based Access Control (RBAC)

- [ ] **Keycloak Config**
  - [ ] Create Roles: `admin`, `manager`, `standard`
  - [ ] Assign `admin` role to your main user
- [ ] **Backend Enforcement**
  - [ ] Create `checkRoles(['admin'])` middleware
  - [ ] Protect Critical Routes (Create/Delete User)
- [ ] **Frontend Logic**
  - [ ] Decode Token to check roles (`keycloak.hasRealmRole`)
  - [ ] Conditionally render buttons (e.g., Hide "Delete" for standard users)

## 🧙 Phase 6: Service Accounts & User Management

- [ ] **Backend Admin Client**
  - [ ] Install `@keycloak/keycloak-admin-client`
  - [ ] Implement `getAdminClient()` helper (Auths as `backend-client`)
- [ ] **CRUD Operations**
  - [ ] **List Users**: Fetch all users from Keycloak
  - [ ] **Delete User**: Delete keycloak user by ID
  - [ ] **Create User**: Add new user to Keycloak

## 📩 Phase 7: User Invitation Flow (Magic Link)

- [ ] **SMTP Setup**
  - [ ] Configure `Realm Settings -> Email` (Gmail App Password)
- [ ] **Invitation Logic**
  - [ ] Backend: Create User with **NO Password**
  - [ ] Backend: Trigger `executeActionsEmail(['UPDATE_PASSWORD'])`
  - [ ] Result: User gets unexpected "Welcome" email to set password

## 📝 Phase 8: Password Management

- [ ] **Self-Service Change**
  - [ ] Frontend: Form for Current & New Password
  - [ ] Backend: Validate Current Pwd (via Login check) -> Set New Pwd
- [ ] **Admin Reset**
  - [ ] Admin clicks "Reset Password" button
  - [ ] Backend triggers "Reset Password" email

## 🎨 Phase 9: Custom Themes & Polish

- [ ] **Themes**
  - [ ] Create `theme/learning-theme` folder
  - [ ] Create Custom Email Templates (`.ftl`)
  - [ ] Activate Theme in Realm Settings
- [ ] **Security Hardening**
  - [ ] Move all secrets to `.env`
  - [ ] Create `.gitignore` to block `keycloak-server/` and `.env`

## 🛡️ Phase 10: OAuth (Social Login)

- [ ] **Setup Identity Provider**
  - [ ] Keycloak: Identity Providers -> GitHub/Google
  - [ ] Copy Client ID & Secret from Provider
- [ ] **Verify Login**
  - [ ] Login screen should show "Sign in with GitHub"

## 🔐 Phase 11: 2-Step Verification (MFA - Optional)

- [ ] **Backend API**
  - [ ] `GET /api/users/me/mfa-status`: Check `otp` credential
  - [ ] `PUT /api/users/me/mfa-status`: Enable (Add Action) / Disable (Delete Credential)
- [ ] **Frontend UI**
  - [ ] User Profile: Add "Two-Factor Authentication" Toggle
- [ ] **User Experience**
  - [ ] Enable: Login -> Scan QR Code
  - [ ] Disable: Credential removed
  - [ ] Copy `Browser` flow to `Browser with MFA`
  - [ ] Add `OTP Form` execution as `REQUIRED`
  - [ ] Bind this new flow to `Browser Flow` in bindings
- [ ] **User Experience**
  - [ ] Login as user
  - [ ] Set up Mobile Authenticator (Google Auth/Microsoft Auth)
  - [ ] Verify Code on login

---
*Ready to verify? Run `npm run dev` in both `api` and `web` folders!*

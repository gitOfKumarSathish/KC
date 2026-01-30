# 🔐 Keycloak Identity Management System

- [🔐 Keycloak Identity Management System](#-keycloak-identity-management-system)
  - [📂 Project Structure](#-project-structure)
    - [File Tree: KC](#file-tree-kc)
  - [🛠️ Prerequisites](#️-prerequisites)
  - [🚀 Setup \& Installation](#-setup--installation)
    - [1. Keycloak Setup](#1-keycloak-setup)
    - [2. Backend Setup (`api/`)](#2-backend-setup-api)
    - [3. Frontend Setup (`web/`)](#3-frontend-setup-web)
  - [🔑 Key Features \& Usage](#-key-features--usage)
  - [📄 License](#-license)

A robust, enterprise-grade Identity Management reference implementation using **Keycloak**, **React**, and **Express.js**.

This project demonstrates:

- **Role Based Access Control (RBAC)**: Fine-grained permissions (Admin vs Standard).
- **Secure Authentication**: Standard OpenID Connect (OIDC) flow.
- **User Invitations**: Custom "Magic Link" email invitations.
- **Password Management**: Self-service change & Admin reset flows.
- **Custom Themes**: Branded email templates.

---

## 📂 Project Structure

- `api/`: Backend Node.js/Express application (Resource Server & Admin Client).
- `web/`: Frontend React application (Public Client).
- `theme/`: Custom Keycloak themes (Emails, Login).
- `keycloak-26.0.0/`: The Keycloak Server (Ignored by Git, see Setup).

### File Tree: KC

**Generated:** 1/30/2026, 10:31:06 AM
**Root Path:** `s:\Learn\KC`

├── 📁 api
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   └── 📄 server.js
├── 📁 theme
│   └── 📁 learning-theme
│       ├── 📁 email
│       │   ├── 📁 html
│       │   │   ├── 📄 executeActions.ftl
│       │   │   └── 📄 password-reset.ftl
│       │   ├── 📁 messages
│       │   │   └── 📄 messages_en.properties
│       │   └── 📄 theme.properties
│       └── 📁 login
│           ├── 📁 resources
│           │   └── 📁 css
│           │       └── 🎨 styles.css
│           └── 📄 theme.properties
├── 📁 web
│   ├── 📁 public
│   │   └── 🖼️ vite.svg
│   ├── 📁 src
│   │   ├── 📁 assets
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 components
│   │   │   ├── 📄 ApiTester.jsx
│   │   │   ├── 📄 ChangePassword.jsx
│   │   │   └── 📄 UserProfile.jsx
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.jsx
│   │   ├── 📄 Dashboard.jsx
│   │   ├── 🎨 LoginPage.css
│   │   ├── 📄 LoginPage.jsx
│   │   ├── 📄 UserList.jsx
│   │   ├── 📄 api.js
│   │   ├── 🎨 index.css
│   │   ├── 📄 keycloak.js
│   │   └── 📄 main.jsx
│   ├── 📝 README.md
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   └── 📄 vite.config.js
├── ⚙️ .gitignore
├── 📝 KEYCLOAK_GUIDE.md
├── 📝 KEYCLOAK_TASKS.md
└── 📝 README.md

---

## 🛠️ Prerequisites

1. **Java JDK 17+**: Required to run Keycloak. verify with `java -version`.
2. **Node.js v18+**: Required for Frontend and Backend.

---

## 🚀 Setup & Installation

### 1. Keycloak Setup

- Download Keycloak 26.0.0 from [keycloak.org](https://www.keycloak.org/downloads).
- Extract it to this root folder (renaming folder to `keycloak-26.0.0` is recommended/ignored).
- **Theme**: Copy the `theme/learning-theme` folder into `keycloak-26.0.0/themes/`.
- **Start**: Run `bin/kc.bat start-dev` (Windows) or `bin/kc.sh start-dev` (Mac/Linux).
- **Config**: Import the `learning-realm` or configure it manually.
  - 📚 **Masterclass Guide**: [KEYCLOAK_GUIDE.md](./KEYCLOAK_GUIDE.md)
  - 📋 **Task Checklist**: [KEYCLOAK_TASKS.md](./KEYCLOAK_TASKS.md)

### 2. Backend Setup (`api/`)

1. Navigate to the folder: `cd api`.
2. Install dependencies: `npm install`.
3. **Environment Variables**: Create a `.env` file with the following content:

    ```properties
    KEYCLOAK_REALM=learning-realm
    KEYCLOAK_AUTH_SERVER_URL=http://localhost:8080/
    KEYCLOAK_RESOURCE=learning-client
    KEYCLOAK_BACKEND_CLIENT_ID=backend-client
    # Get this from Keycloak Console -> Clients -> backend-client -> Credentials
    KEYCLOAK_CLIENT_SECRET=YOUR_SECRET_GOES_HERE
    PORT=3000
    ```

4. Start server: `npm run dev`.

### 3. Frontend Setup (`web/`)

1. Navigate to the folder: `cd web`.
2. Install dependencies: `npm install`.
3. **Environment Variables**: Create a `.env` file with the following content:

    ```properties
    VITE_KEYCLOAK_URL=http://localhost:8080/
    VITE_KEYCLOAK_REALM=learning-realm
    VITE_KEYCLOAK_CLIENT_ID=learning-client
    ```

4. Start app: `npm run dev`.

---

## 🔑 Key Features & Usage

1. **Login**: Access the web app. You will be redirected to Keycloak.
2. **Dashboard**:
    - **User Profile**: View your claims (JWT data).
    - **API Test**: Click "Call Protected API" to verify the backend token validation.
    - **Change Password**: Update your password directly from the UI.
3. **Admin Features** (Login as User with `admin` role):
    - **User Management**: Create (Invite), List, and Delete users.
    - **Reset Password**: Trigger password reset emails for other users.

---

## 📄 License

This project is for educational purposes.

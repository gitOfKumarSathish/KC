import React, { useState } from 'react';
import UserList from './UserList';
import UserProfile from './components/UserProfile';
import ChangePassword from './components/ChangePassword';
import ApiTester from './components/ApiTester';
import { authorizedFetch } from './api';

const Dashboard = ({ userProfile, logout, keycloakToken }) => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    return (
        <div className="container">
            {/* Header / Navbar */}
            <div className="d-flex justify-between align-center mb-4">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Welcome, {userProfile?.firstName}! 👋</h1>
                    <p className="text-muted">Secure Identity Admin Console</p>
                </div>
                <div className="d-flex gap-4">
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="btn btn-secondary"
                    >
                        {showPasswordForm ? 'Close Password Form' : 'Change Password'}
                    </button>
                    <button
                        onClick={logout}
                        className="btn btn-danger"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="dashboard-grid">
                {/* Left Column: Sidebar / Tools */}
                <div className="d-flex" style={{ flexDirection: 'column', gap: '20px' }}>
                    <UserProfile userProfile={userProfile} />
                    <ApiTester />
                </div>

                {/* Right Column: Key Actions */}
                <div className="d-flex" style={{ flexDirection: 'column', gap: '20px' }}>
                    {showPasswordForm && (
                        <div className="card">
                            <ChangePassword onClose={() => setShowPasswordForm(false)} />
                        </div>
                    )}

                    <UserList keycloakToken={keycloakToken} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

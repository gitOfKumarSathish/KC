import React, { useState } from 'react';
import UserList from './UserList';
import UserProfile from './components/UserProfile';
import ChangePassword from './components/ChangePassword';
import ApiTester from './components/ApiTester';
import { authorizedFetch } from './api';

const Dashboard = ({ userProfile, logout, keycloakToken }) => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    return (
        <div style={{ padding: '40px', fontFamily: '"Inter", "Segoe UI", sans-serif', maxWidth: '100%', margin: '0 auto', background: '#f5f6fa', minHeight: '100vh' }}>

            {/* Header / Navbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ color: '#2d3436', margin: '0 0 5px 0', fontSize: '2rem' }}>Welcome, {userProfile?.firstName}! 👋</h1>
                    <p style={{ color: '#636e72', margin: 0 }}>Secure Identity Admin Console</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        style={{
                            padding: '10px 20px',
                            background: showPasswordForm ? '#bdc3c7' : '#e17055',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}>
                        {showPasswordForm ? 'Close Password Form' : 'Change Password'}
                    </button>
                    <button
                        onClick={logout}
                        style={{
                            padding: '10px 20px',
                            background: '#fab1a0',
                            color: '#d63031',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px', alignItems: 'start' }}>

                {/* Left Column: Sidebar / Tools */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <UserProfile userProfile={userProfile} />
                    <ApiTester />
                </div>

                {/* Right Column: Key Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {showPasswordForm && (
                        <ChangePassword onClose={() => setShowPasswordForm(false)} />
                    )}

                    <UserList keycloakToken={keycloakToken} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

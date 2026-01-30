import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../api';

const UserProfile = ({ userProfile }) => {
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (userProfile) {
            checkMfaStatus();
        }
    }, [userProfile]);

    const checkMfaStatus = async () => {
        try {
            const res = await authorizedFetch('http://localhost:3000/api/users/me/mfa-status');
            if (res.ok) {
                const data = await res.json();
                setMfaEnabled(data.enabled);
            }
        } catch (error) {
            console.error("Failed to check MFA status", error);
        }
    };

    const toggleMfa = async () => {
        setLoading(true);
        setStatusMessage('');
        try {
            const res = await authorizedFetch('http://localhost:3000/api/users/me/mfa-status', {
                method: 'PUT',
                body: JSON.stringify({ enable: !mfaEnabled })
            });
            const data = await res.json();

            if (res.ok) {
                setMfaEnabled(!mfaEnabled);
                setStatusMessage(data.message);
                // If enabling, we might want to alert them
                if (!mfaEnabled) {
                    alert("MFA Setup Initiated! Please Logout and Login again to configure your Authenticator App.");
                }
            } else {
                setStatusMessage("Error: " + data.error);
            }
        } catch (error) {
            setStatusMessage("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#555', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>User Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div>
                    <strong style={{ display: 'block', color: '#888', fontSize: '0.85rem' }}>Full Name</strong>
                    <div style={{ fontSize: '1.1rem', color: '#333' }}>{userProfile?.firstName} {userProfile?.lastName}</div>
                </div>
                <div>
                    <strong style={{ display: 'block', color: '#888', fontSize: '0.85rem' }}>Username</strong>
                    <div style={{ fontSize: '1.1rem', color: '#333' }}>{userProfile?.username}</div>
                </div>
                <div>
                    <strong style={{ display: 'block', color: '#888', fontSize: '0.85rem' }}>Email</strong>
                    <div style={{ fontSize: '1.1rem', color: '#333' }}>{userProfile?.email}</div>
                </div>
                <div>
                    <strong style={{ display: 'block', color: '#888', fontSize: '0.85rem' }}>Keycloak ID</strong>
                    <div style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'monospace' }}>{userProfile?.id}</div>
                </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Security Settings</h4>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <div>
                        <strong style={{ display: 'block', marginBottom: '5px' }}>Two-Factor Authentication (2FA)</strong>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>
                            {mfaEnabled
                                ? "Your account is secured with an Authenticator App."
                                : "Add an extra layer of security to your account."}
                        </span>
                        {statusMessage && <div style={{ fontSize: '0.85rem', color: '#007bff', marginTop: '5px' }}>{statusMessage}</div>}
                    </div>

                    <button
                        onClick={toggleMfa}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            background: mfaEnabled ? '#dc3545' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loading ? 'wait' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Processing...' : (mfaEnabled ? 'Disable 2FA' : 'Enable 2FA')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

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
        <div className="card">
            <h3 className="card-header">User Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div>
                    <strong className="form-label">Full Name</strong>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{userProfile?.firstName} {userProfile?.lastName}</div>
                </div>
                <div>
                    <strong className="form-label">Username</strong>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{userProfile?.username}</div>
                </div>
                <div>
                    <strong className="form-label">Email</strong>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{userProfile?.email}</div>
                </div>
                <div>
                    <strong className="form-label">Keycloak ID</strong>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{userProfile?.id}</div>
                </div>
            </div>

            <div className="mt-4" style={{ paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-muted)' }}>Security Settings</h4>

                <div className="d-flex align-center justify-between" style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: 'var(--radius-md)' }}>
                    <div>
                        <strong style={{ display: 'block', marginBottom: '5px' }}>Two-Factor Authentication (2FA)</strong>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {mfaEnabled
                                ? "Your account is secured with an Authenticator App."
                                : "Add an extra layer of security to your account."}
                        </span>
                        {statusMessage && <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginTop: '5px' }}>{statusMessage}</div>}
                    </div>

                    <button
                        onClick={toggleMfa}
                        disabled={loading}
                        className={`btn ${mfaEnabled ? 'btn-danger' : 'btn-success'}`}
                        style={{ minWidth: '140px' }}
                    >
                        {loading ? 'Processing...' : (mfaEnabled ? 'Disable 2FA' : 'Enable 2FA')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

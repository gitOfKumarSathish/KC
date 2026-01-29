import React, { useState } from 'react';
import { authorizedFetch } from '../api';

const ChangePassword = ({ onClose }) => {
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await authorizedFetch('http://localhost:3000/api/update-password', {
                method: 'PUT',
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update password");
            }

            alert("Password updated successfully! 🎉");
            onClose(); // Close the form on success
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: '#fff0f0',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #ffcccc',
            marginBottom: '20px',
            animation: 'fadeIn 0.3s ease-in'
        }}>
            <h3 style={{ marginTop: 0, color: '#d63031' }}>🔐 Set New Password</h3>
            <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="password"
                    placeholder="Current Password"
                    required
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#d63031',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1
                        }}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#eee',
                            color: '#333',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;

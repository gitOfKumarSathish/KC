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
            background: '#fff1f2', /* Light Red/Rose background for sensitive action */
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #fecdd3',
            marginBottom: '20px',
            animation: 'fadeIn 0.3s ease-in'
        }}>
            <h3 className="card-header card-title-danger">🔐 Set New Password</h3>
            <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Current Password"
                        required
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="form-input"
                    />
                </div>
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="form-input"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="form-input"
                    />
                </div>
                <div className="d-flex gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-danger"
                        style={{ flex: 1 }}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;

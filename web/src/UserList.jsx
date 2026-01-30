import React, { useState, useEffect } from 'react';
import keycloak from './keycloak'; // Import Keycloak instance
import { authorizedFetch } from './api';

const UserList = ({ keycloakToken }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Role Checks
    const isAdmin = keycloak.hasRealmRole('admin');
    const isManager = keycloak.hasRealmRole('manager');

    // Permissions
    const canCreate = isAdmin;
    const canDelete = isAdmin || isManager;

    // New User State
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'standard', // Default role
        sendInvitation: true // Default to sending email
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await authorizedFetch('http://localhost:3000/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await authorizedFetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete user');
            fetchUsers(); // Refresh list
        } catch (err) {
            alert(err.message);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        try {
            const response = await authorizedFetch('http://localhost:3000/api/users', {
                method: 'POST',
                body: JSON.stringify(newUser)
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to create user');
            }

            const data = await response.json();
            if (data.warning) alert(data.warning);
            else alert("User created successfully! Invitation sent.");

            setNewUser({ username: '', email: '', firstName: '', lastName: '', phoneNumber: '', role: 'standard', sendInvitation: true }); // Reset form
            fetchUsers(); // Refresh list
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const sendResetEmail = async (userId) => {
        if (!window.confirm("Send password reset email to this user?")) return;
        try {
            const response = await authorizedFetch(`http://localhost:3000/api/users/${userId}/reset-password`, {
                method: 'PUT'
            });
            if (!response.ok) throw new Error('Failed to send reset email');
            alert("Reset email sent successfully!");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ marginTop: '30px' }}>
            {/* CREATE USER FORM - Only Admins */}
            {canCreate && <div className="card">
                <h3 className="card-header">Create New User</h3>
                <form onSubmit={createUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input placeholder="Username" required value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className="form-input" />
                    <input placeholder="Email" type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="form-input" />
                    <input placeholder="First Name" required value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} className="form-input" />
                    <input placeholder="Last Name" required value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} className="form-input" />
                    <input placeholder="Phone Number" required value={newUser.phoneNumber} onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })} className="form-input" />

                    {/* Role Selection Dropdown */}
                    <div className="d-flex align-center" style={{ gridColumn: 'span 1' }}>
                        <select
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            className="form-input"
                            style={{ background: 'white' }}
                        >
                            <option value="standard">Standard User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Invitation Checkbox */}
                    <div className="d-flex align-center gap-2" style={{ gridColumn: 'span 2' }}>
                        <label className="d-flex align-center gap-2" style={{ cursor: 'pointer', background: 'var(--bg-color)', padding: '10px', borderRadius: 'var(--radius-md)', width: '100%' }}>
                            <input
                                type="checkbox"
                                checked={newUser.sendInvitation}
                                onChange={e => setNewUser({ ...newUser, sendInvitation: e.target.checked })}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <span style={{ fontWeight: '500', color: 'var(--primary-color)' }}>Send Invitation Email (Magic Link) - No Default Password</span>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Create User</button>
                </form>
            </div>}

            {/* USER LIST */}
            <h2 style={{ color: 'var(--text-main)', marginTop: '40px' }}>User Management</h2>
            {error && <div className="text-danger mb-4">{error}</div>}

            <div className="table-container card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td style={{ fontWeight: '500' }}>{user.username}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td className="text-muted">{user.email}</td>
                                <td style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>
                                    {user.attributes?.phoneNumber ? user.attributes.phoneNumber[0] : '-'}
                                </td>
                                <td className="d-flex gap-2">
                                    {isAdmin && (
                                        <button
                                            onClick={() => sendResetEmail(user.id)}
                                            className="btn btn-secondary btn-sm">
                                            Reset Pwd
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="btn btn-danger btn-sm">
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading users...</p>}
            </div>
        </div>
    );
};

export default UserList;

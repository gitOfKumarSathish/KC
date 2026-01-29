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
            {canCreate && <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Create New User</h3>
                <form onSubmit={createUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input placeholder="Username" required value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input placeholder="Email" type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input placeholder="First Name" required value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input placeholder="Last Name" required value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input placeholder="Phone Number" required value={newUser.phoneNumber} onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />

                    {/* Role Selection Dropdown */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', gridColumn: 'span 1' }}>
                        <select
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', background: 'white', flex: 1 }}
                        >
                            <option value="standard">Standard User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Invitation Checkbox */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', gridColumn: 'span 2' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#e3f2fd', padding: '10px', borderRadius: '5px', width: '100%' }}>
                            <input
                                type="checkbox"
                                checked={newUser.sendInvitation}
                                onChange={e => setNewUser({ ...newUser, sendInvitation: e.target.checked })}
                            />
                            <span style={{ fontWeight: '500', color: '#0984e3' }}>Send Invitation Email (Magic Link) - No Default Password</span>
                        </label>
                    </div>

                    <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', background: '#00b894', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Create User</button>
                </form>
            </div>}

            {/* USER LIST */}
            <h2 style={{ color: '#333' }}>User Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '10px', padding: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', color: '#666', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Username</th>
                            <th style={{ padding: '12px' }}>First Name</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Phone</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{user.username}</td>
                                <td style={{ padding: '12px' }}>{user.firstName} {user.lastName}</td>
                                <td style={{ padding: '12px', color: '#555' }}>{user.email}</td>
                                <td style={{ padding: '12px', color: '#667eea', fontWeight: 'bold' }}>
                                    {user.attributes?.phoneNumber ? user.attributes.phoneNumber[0] : '-'}
                                </td>
                                <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                                    {isAdmin && (
                                        <button
                                            onClick={() => sendResetEmail(user.id)}
                                            style={{ padding: '6px 12px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                            Reset Pwd
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            style={{ padding: '6px 12px', background: '#ff7675', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
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

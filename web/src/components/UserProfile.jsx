import React from 'react';

const UserProfile = ({ userProfile }) => {
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

            {/* Raw JSON Toggle could go here if needed, but keeping it clean for now */}
        </div>
    );
};

export default UserProfile;

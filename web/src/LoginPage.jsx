import React from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    return (
        <>
            <div className="login-container">
                <div className="login-header">
                    <h1>Welcome</h1>
                    <p>Please log in to access your dashboard</p>
                </div>
                <button className="login-btn" onClick={onLogin}>
                    Sign In with SS0
                </button>
            </div>

            <ul className="circles">
                <li></li><li></li><li></li><li></li><li></li>
                <li></li><li></li><li></li><li></li><li></li>
            </ul>
        </>
    );
};

export default LoginPage;

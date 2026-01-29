import React, { useState } from 'react';
import { authorizedFetch } from '../api';

const ApiTester = () => {
    const [apiResponse, setApiResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const callProtectedApi = async () => {
        setLoading(true);
        try {
            const response = await authorizedFetch('http://localhost:3000/api/protected');
            const data = await response.json();
            setApiResponse(data); // Store object, not string
        } catch (error) {
            setApiResponse({ error: "Error calling API: " + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#555' }}>Backend Connectivity</h3>
                <button
                    onClick={callProtectedApi}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        background: '#6c5ce7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        opacity: loading ? 0.7 : 1
                    }}>
                    {loading ? 'Connecting...' : 'Test Protected API'}
                </button>
            </div>

            {apiResponse && (
                <div style={{
                    background: '#2d3436',
                    color: '#dfe6e9',
                    padding: '15px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '0.7rem',
                        background: apiResponse.error ? '#ff7675' : '#00b894',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'white'
                    }}>
                        {apiResponse.error ? 'ERROR' : 'SUCCESS'}
                    </div>
                    <pre style={{ margin: 0, fontFamily: 'Consolas, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ApiTester;

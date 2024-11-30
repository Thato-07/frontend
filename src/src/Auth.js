// src/Auth.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setLoggedInUser, users, setUsers }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [successMessage, setSuccessMessage] = useState(''); // Success message state
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegistering ? 'http://localhost:5000/users' : 'http://localhost:5000/login';
        setLoading(true); // Start loading
        setSuccessMessage(''); // Reset success message

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            if (isRegistering) {
                setSuccessMessage('User registered successfully'); // Set success message
                setUsers([...users, data]);
            } else {
                setLoggedInUser(data);
                setSuccessMessage('User loggedin successfully');
                navigate('/product-management');
            }
            setFormData({ username: '', password: '' });
            setErrorMessage('');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error: ' + error.message);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
                </button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Success message in the middle */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Switch to Login' : 'Switch to Register'}
            </button>
        </div>
    );
};

export default Auth;
// src/Navigation.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ onLogout, loggedIn }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav>
            {!loggedIn && (
                <button onClick={() => handleNavigation('/')}>Home</button>
            )}
            {loggedIn && (
                <>
                    <button onClick={() => handleNavigation('/product-management')}>Product Management</button>
                    <button onClick={() => handleNavigation('/stock-management')}>Stock Management</button>
                    <button onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
                    <button onClick={() => handleNavigation('/user-management')}>User Management</button>
                    <button onClick={onLogout}>Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navigation;
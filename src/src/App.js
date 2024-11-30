import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import StockManagement from './StockManagement';
import UserManager from './UserManager';
import Navigation from './Navigation';
import './index.css';

// PrivateRoute component to handle protected routes
const PrivateRoute = ({ element, loggedInUser }) => {
    return loggedInUser ? element : <Navigate to="/" />;
};

const App = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleLogout = () => {
        setLoggedInUser(null);
        // Redirect to home after logout
        window.location.href = '/';
    };

    return (
        <div className="container">
            <h1>Wing Cafe Inventory System</h1>
            <Navigation onLogout={handleLogout} loggedIn={!!loggedInUser} />

            <Routes>
                <Route path="/" element={<Auth setLoggedInUser={setLoggedInUser} users={users} setUsers={setUsers} />} />
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard products={products} />} loggedInUser={loggedInUser} />} />
                <Route path="/product-management" element={<PrivateRoute element={<ProductManagement products={products} setProducts={setProducts} />} loggedInUser={loggedInUser} />} />
                <Route path="/stock-management" element={<PrivateRoute element={<StockManagement products={products} setProducts={setProducts} />} loggedInUser={loggedInUser} />} />
                <Route path="/user-management" element={<PrivateRoute element={<UserManager users={users} setUsers={setUsers} />} loggedInUser={loggedInUser} />} />
            </Routes>
        </div>
    );
};

export default App;
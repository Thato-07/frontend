import React, { useState, useEffect } from 'react';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({ username: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    // Fetch users from the server on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            // Update user in the database
            const response = await fetch(`http://localhost:5000/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                const updatedUsers = users.map((usr, index) => (index === editIndex ? updatedUser : usr));
                setUsers(updatedUsers);
            }
            setIsEditing(false);
            setEditIndex(null);
        } else {
            // Add new user to the database
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const newUser = await response.json();
                setUsers([...users, newUser]);
            }
        }
        setUser({ username: '', password: '' });
    };

    const handleDelete = async (index) => {
        const userToDelete = users[index];

        const response = await fetch(`http://localhost:5000/users/${userToDelete.id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const newUsers = users.filter((_, i) => i !== index);
            setUsers(newUsers);
        }
    };

    const handleEdit = (index) => {
        setUser(users[index]);
        setIsEditing(true);
        setEditIndex(index);
    };

    return (
        <div>
            <h2>User Management</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
            </form>
            <h3>User List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((usr, index) => (
                        <tr key={index}>
                            <td>{usr.username}</td>
                            <td>
                                <button onClick={() => handleEdit(index)}>Edit</button>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManager;
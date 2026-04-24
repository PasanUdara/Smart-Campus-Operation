import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, deleteUser } from '../api/userApi';
import axios from 'axios';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        name: "",
        role: "USER",
        password: ""
    });
    const [bulkUsers, setBulkUsers] = useState("");
    const { token, loading: authLoading } = useAuth();  // ADD authLoading

    // Only fetch users when auth is done loading AND token exists
    useEffect(() => {
        if (!authLoading && token) {
            fetchUsers();
        }
    }, [authLoading, token]);  // Add dependencies

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getAllUsers(token);
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (window.confirm(`Delete user ${userEmail}?`)) {
            try {
                await deleteUser(token, userId);
                fetchUsers();
            } catch (err) {
                console.error('Failed to delete user:', err);
            }
        }
    };

    const handleCreateUser = async () => {
          console.log("Token for create user:", token);  // ADD THIS
    console.log("New user data:", newUser);        // ADD THIS
        if (!newUser.email || !newUser.name) {
            alert("Email and Name are required");
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8080/api/users', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                alert(`User created successfully!\nEmail: ${newUser.email}\nPassword: ${response.data.password}\n\nPlease share this password with the user.`);
                setShowCreateModal(false);
                setNewUser({ email: "", name: "", role: "USER", password: "" });
                fetchUsers();
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert("Failed to create user: " + (err.response?.data?.message || err.message));
        }
    };

    const handleBulkCreate = async () => {
        if (!bulkUsers.trim()) {
            alert("Please enter user data");
            return;
        }
        
        try {
            const usersList = bulkUsers.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    const parts = line.split(',').map(s => s.trim());
                    return {
                        email: parts[0],
                        name: parts[1],
                        role: parts[2] ? parts[2].toUpperCase() : "USER"
                    };
                });
            
            const response = await axios.post('http://localhost:8080/api/users/bulk', usersList, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            let message = `Bulk upload complete!\nSuccess: ${response.data.successCount} / ${response.data.total}\n\n`;
            if (response.data.results) {
                response.data.results.forEach(r => {
                    if (r.success) {
                        message += `✅ ${r.email} - Password: ${r.password}\n`;
                    } else {
                        message += `❌ ${r.email} - ${r.message}\n`;
                    }
                });
            }
            alert(message);
            setShowBulkModal(false);
            setBulkUsers("");
            fetchUsers();
        } catch (err) {
            alert("Bulk upload failed: " + err.message);
        }
    };

    // Show loading while auth is loading OR users are loading
    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-zinc-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                    >
                        + Add User
                    </button>
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="bg-zinc-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-zinc-600 transition"
                    >
                        Bulk Upload
                    </button>
                </div>
            </div>
            
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Roles
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-zinc-800/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {user.roles?.map(role => (
                                        <span key={role} className="inline-block px-2 py-1 text-xs rounded bg-zinc-700 text-zinc-300 mr-1">
                                            {role.replace('ROLE_', '')}
                                        </span>
                                    ))}
                                    {(!user.roles || user.roles.length === 0) && (
                                        <span className="text-zinc-500">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        user.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {user.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleDeleteUser(user.id, user.email)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        disabled={user.email === 'admin@smartcampus.com'}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="bg-zinc-900 rounded-2xl p-6 w-96 border border-zinc-800">
                        <h3 className="text-xl font-bold mb-4 text-white">Create New User</h3>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email *"
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                            />
                            <input
                                type="text"
                                placeholder="Name *"
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                            />
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                            >
                                <option value="USER">User (Student)</option>
                                <option value="TECHNICIAN">Technician</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Password (leave empty for auto-generate)"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                            />
                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={handleCreateUser} 
                                    className="flex-1 bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                                >
                                    Create
                                </button>
                                <button 
                                    onClick={() => setShowCreateModal(false)} 
                                    className="flex-1 bg-zinc-800 text-white py-2 rounded-lg hover:bg-zinc-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="bg-zinc-900 rounded-2xl p-6 w-[500px] border border-zinc-800">
                        <h3 className="text-xl font-bold mb-4 text-white">Bulk Upload Users</h3>
                        <p className="text-zinc-400 text-sm mb-2">Format: email, name, role (one per line)</p>
                        <p className="text-zinc-500 text-xs mb-4">
                            Example:<br/>
                            student1@example.com, John Doe, USER<br/>
                            tech1@example.com, Jane Smith, TECHNICIAN
                        </p>
                        <textarea
                            rows={8}
                            placeholder="student1@example.com, John Doe, USER&#10;tech1@example.com, Jane Smith, TECHNICIAN&#10;admin2@example.com, Bob Admin, ADMIN"
                            value={bulkUsers}
                            onChange={(e) => setBulkUsers(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                        />
                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={handleBulkCreate} 
                                className="flex-1 bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                            >
                                Upload
                            </button>
                            <button 
                                onClick={() => setShowBulkModal(false)} 
                                className="flex-1 bg-zinc-800 text-white py-2 rounded-lg hover:bg-zinc-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
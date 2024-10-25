import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListUsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Lista de Usuários</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListUsersPage;

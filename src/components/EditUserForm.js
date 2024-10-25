import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUserForm = ({ user, fetchUsers }) => {
  const [name, setName] = useState(user.name);
  const [privileges, setPrivileges] = useState(user.privileges);

  useEffect(() => {
    setName(user.name);
    setPrivileges(user.privileges);
  }, [user]);

  const handleEditUser = async () => {
    if (!name || privileges.length === 0) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${user.cpf}`, {
        name,
        privileges,
      });
      fetchUsers(); // Atualiza a lista de usuários
      setName('');
      setPrivileges([]);
    } catch (err) {
      console.error('Erro ao editar usuário:', err);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
        className="mt-2 p-2 border rounded w-full"
      />
      <div className="mt-2">
        <label>Privilégios:</label>
        <select multiple value={privileges} onChange={(e) => setPrivileges([...e.target.selectedOptions].map(opt => opt.value))}>
          <option value="admin">Administrador</option>
          <option value="driver">Motorista</option>
          <option value="operational">Operacional</option>
        </select>
      </div>
      <button onClick={handleEditUser} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Salvar Edição
      </button>
    </div>
  );
};

export default EditUserForm;

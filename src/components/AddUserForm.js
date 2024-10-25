import React, { useState } from 'react';
import axios from 'axios';

const AddUserForm = () => {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [privileges, setPrivileges] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddUser = async () => {
    if (!cpf || !name || privileges.length === 0) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users', {
        cpf,
        name,
        privileges,
      });
      setSuccess('Usuário adicionado com sucesso!');
      setError('');
      setCpf('');
      setName('');
      setPrivileges([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao adicionar usuário');
      setSuccess('');
    }
  };

  const handleCheckboxChange = (privilege) => {
    if (privilege === 'admin') {
      if (privileges.includes('admin')) {
        setPrivileges(prev => prev.filter(p => p !== 'admin')); // Desmarca "admin"
      } else {
        setPrivileges(['driver', 'operational', 'admin']); // Marca todos
      }
    } else {
      setPrivileges(prev =>
        prev.includes(privilege)
          ? prev.filter(p => p !== privilege)
          : [...prev, privilege]
      );
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Adicionar Usuário</h2>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={privileges.includes('driver')}
            onChange={() => handleCheckboxChange('driver')}
          />
          Motorista
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={privileges.includes('operational')}
            onChange={() => handleCheckboxChange('operational')}
          />
          Operacional
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={privileges.includes('admin')}
            onChange={() => handleCheckboxChange('admin')}
          />
          Administrador
        </label>
      </div>
      <button
        onClick={handleAddUser}
        className="py-2 px-4 bg-blue-500 text-white rounded"
      >
        Adicionar Usuário
      </button>
    </div>
  );
};

export default AddUserForm;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { GiAutoRepair } from 'react-icons/gi';
import { FaBus, FaTrash, FaEdit, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import AddUserForm from './AddUserForm';
import { toast } from 'react-toastify';

const DashboardPage = ({ user }) => {
  const [showUserActions, setShowUserActions] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      toast.error('Erro ao buscar usuários. Tente novamente.');
    }
  };

  const handleRemoveUser = async (cpf) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${cpf}`);
      setUsers(users.filter((user) => user.cpf !== cpf));
      toast.success('Usuário removido com sucesso.');
    } catch (err) {
      console.error('Erro ao remover usuário:', err);
      toast.error('Erro ao remover usuário. Tente novamente.');
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${updatedUser.cpf}`, updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.cpf === updatedUser.cpf ? updatedUser : user))
      );
      setEditUser(null);
      toast.success('Usuário atualizado com sucesso.');
    } catch (err) {
      console.error('Erro ao editar usuário:', err);
      toast.error('Erro ao atualizar usuário. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const isAdmin = user?.privileges?.includes('admin') || false;

  const privilegeLabels = {
    admin: 'Administrador',
    driver: 'Motorista',
    operational: 'Operacional',
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="w-full max-w-4xl p-10 bg-white/10 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md">
        <h1 className="text-4xl font-extrabold text-center text-white tracking-wide mb-10">
          Bem-vindo, {user.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.privileges.includes('driver') && (
            <Link
              to="/access/driver"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-950 text-white rounded-lg shadow-md 
              hover:shadow-xl hover:bg-pink-600 transition transform hover:scale-105"
            >
              <FaBus className="text-2xl" /> Acesso Motorista
            </Link>
          )}

          {user.privileges.includes('operational') && (
            <Link
              to="/access/operational"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-950 text-white rounded-lg shadow-md 
              hover:shadow-xl hover:bg-pink-600 transition transform hover:scale-105"
            >
              <GiAutoRepair className="text-2xl" /> Acesso Operacional
            </Link>
          )}

          <Link
            to="/office"
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-950 text-white rounded-lg shadow-md 
            hover:shadow-xl hover:bg-pink-600 transition transform hover:scale-105"
          >
            <FaBuilding className="text-2xl" /> Escritório
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-950 text-white rounded-lg shadow-md 
            hover:shadow-xl hover:bg-pink-600 transition transform hover:scale-105"
          >
            <FaSignOutAlt className="text-2xl" /> Sair
          </button>
        </div>

        {isAdmin && (
          <>
            <button
              onClick={() => setShowUserActions((prev) => !prev)}
              className="w-full mt-6 px-6 py-3 bg-pink-600 text-white rounded-lg shadow-md hover:shadow-xl 
              transition transform hover:scale-105"
            >
              {showUserActions ? 'Ocultar Ações de Usuário' : 'Gerenciar Usuários'}
            </button>

            {showUserActions && (
              <div className="space-y-6 mt-6">
                <button
                  onClick={() => setShowAddUserForm((prev) => !prev)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition transform hover:scale-105"
                >
                  {showAddUserForm ? 'Ocultar Formulário' : 'Adicionar Usuário'}
                </button>
                {showAddUserForm && <AddUserForm />}

                <input
                  type="text"
                  placeholder="Pesquisar usuário"
                  className="w-full p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="grid grid-cols-1 gap-4 mt-4">
                  {filteredUsers.map((u) => (
                    <div key={u.cpf} className="bg-white/80 p-4 rounded-lg shadow-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{u.name}</h3>
                        <p>{u.cpf}</p>
                        <p>Privilégios: {u.privileges.map((p) => privilegeLabels[p] || p).join(', ')}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setEditUser(u)}
                          className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110"
                        >
                          <FaEdit />
                        </button>
                        {!u.privileges.includes('admin') && (
                          <button
                            onClick={() => handleRemoveUser(u.cpf)}
                            className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {editUser && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditUser(editUser);
            }}
            className="mt-6 space-y-4"
          >
            <input
              type="text"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-md"
              placeholder="Nome"
              required
            />
            <input
              type="text"
              value={editUser.cpf}
              onChange={(e) => setEditUser({ ...editUser, cpf: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-md"
              placeholder="CPF"
              required
            />
            <div className="flex space-x-4">
              {['driver', 'admin', 'operational'].map((privilege) => (
                <label key={privilege} className="block">
                  <input
                    type="checkbox"
                    checked={editUser.privileges.includes(privilege)}
                    onChange={() => {
                      const newPrivileges = editUser.privileges.includes(privilege)
                        ? editUser.privileges.filter((p) => p !== privilege)
                        : [...editUser.privileges, privilege];
                      setEditUser({ ...editUser, privileges: newPrivileges });
                    }}
                  />{' '}
                  {privilegeLabels[privilege]}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition transform hover:scale-105"
            >
              Salvar Alterações
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

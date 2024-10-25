import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ setUser }) => {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Função de validação básica do CPF (11 dígitos)
  const isValidCPF = (cpf) => {
    return /^\d{11}$/.test(cpf);
  };

  const handleLogin = async () => {
    // Validação do CPF
    if (!isValidCPF(cpf)) {
      setError('CPF inválido. Deve ter 11 dígitos.');
      return;
    }

    try {
      // Envia o CPF para o backend
      const response = await axios.post('http://localhost:5000/api/users/login', { cpf });
      const user = response.data;
      
      // Seta o usuário no estado global do app
      setUser({ cpf: user.cpf, name: user.name, privileges: user.privileges });
      
      // Redireciona para o dashboard após login bem-sucedido
      navigate('/dashboard');
    } catch (err) {
      // Trata possíveis erros, como CPF não encontrado ou erro no servidor
      setError(err.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl transform transition duration-500 hover:scale-105">
        <div className="flex justify-center mb-6">
          <img src="/images/logo.svg" alt="Logo" className="h-20 " />
        </div>
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Login
        </h1>
        {error && (
          <div className="text-red-500 mb-4 text-center flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 mb-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500 transition duration-300"
        />
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-pink-600 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

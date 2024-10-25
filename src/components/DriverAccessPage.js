import React from 'react';
import { useNavigate } from 'react-router-dom';

const DriverAccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Acesso Motorista</h1>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Voltar para Login
        </button>
      </div>
    </div>
  );
};

export default DriverAccessPage;

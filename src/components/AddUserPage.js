// src/pages/AddUserPage.js
import React from 'react';
import AddUserForm from '../components/AddUserForm';

const AddUserPage = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Adicionar Novo Usuário</h1>
        <AddUserForm />
      </div>
    </div>
  );
};

export default AddUserPage;

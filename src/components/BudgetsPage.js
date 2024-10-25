// src/pages/BudgetsPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    date: '',
    name: '',
    vehicle: '',
    observation: '',
    attachment: null,
  });
  const [activeTab, setActiveTab] = useState('novo'); // Aba ativa

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewBudget((prev) => ({ ...prev, attachment: file }));
  };

  const handleAddBudget = () => {
    setBudgets([...budgets, { ...newBudget, status: 'Pendente' }]);
    setNewBudget({ date: '', name: '', vehicle: '', observation: '', attachment: null });
    setActiveTab('lista'); // Muda para a aba "Lista" após salvar
  };

  const downloadAttachment = (attachment) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(attachment);
    link.download = attachment.name;
    link.click();
  };

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
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Orçamentos
        </h1>

        <div className="flex space-x-4 mb-6">
          <button
            className={`w-1/2 py-2 rounded-lg ${
              activeTab === 'novo' ? 'bg-blue-950 text-white' : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => setActiveTab('novo')}
          >
            Novo Orçamento
          </button>
          <button
            className={`w-1/2 py-2 rounded-lg ${
              activeTab === 'lista' ? 'bg-blue-950 text-white' : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => setActiveTab('lista')}
          >
            Orçamentos
          </button>
        </div>

        {activeTab === 'novo' ? (
          <div className="flex flex-col space-y-4">
            <input
              type="date"
              name="date"
              value={newBudget.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={newBudget.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="vehicle"
              placeholder="Veículo"
              value={newBudget.vehicle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            <textarea
              name="observation"
              placeholder="Observações"
              value={newBudget.observation}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              rows="3"
            />
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md"
            />

            <button
              onClick={handleAddBudget}
              className="w-full bg-blue-950 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-300 ease-in-out"
            >
              Salvar Orçamento
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4"></h2>
            <ul className="space-y-4">
              {budgets.map((budget, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col space-y-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Data: {budget.date}</p>
                      <p>Veículo: {budget.vehicle}</p>
                      <p>Motorista: {budget.name}</p>
                    </div>
                    {budget.attachment && (
                      <button
                        onClick={() => downloadAttachment(budget.attachment)}
                        className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-300"
                      >
                        Baixar
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600">Observações: {budget.observation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          to="/access/operational"
          className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-300 ease-in-out"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default BudgetsPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VistoriasVale = () => {
  const [activeTab, setActiveTab] = useState('agendadas');
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ resultado: '', fiscal: '' });
  const [currentVistoriaIndex, setCurrentVistoriaIndex] = useState(null);
  const [formData, setFormData] = useState({
    dataHora: '',
    contrato: '',
    veiculo: '',
    tipo: 'MEV',
  });
  const [vistoriasAgendadas, setVistoriasAgendadas] = useState([]);
  const [vistoriasConcluidas, setVistoriasConcluidas] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVistoriasAgendadas([...vistoriasAgendadas, formData]);
    setShowForm(false);
    setFormData({ dataHora: '', contrato: '', veiculo: '', tipo: 'MEV' });
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '');
  };

  const handleConcluir = (index) => {
    setCurrentVistoriaIndex(index);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const vistoriaConcluida = {
      ...vistoriasAgendadas[currentVistoriaIndex],
      resultado: modalData.resultado,
      fiscal: modalData.fiscal,
    };
    setVistoriasAgendadas(vistoriasAgendadas.filter((_, i) => i !== currentVistoriaIndex));
    setVistoriasConcluidas([...vistoriasConcluidas, vistoriaConcluida]);
    setShowModal(false);
    setModalData({ resultado: '', fiscal: '' });
  };

  const handleDeleteAgendada = (index) => {
    setVistoriasAgendadas(vistoriasAgendadas.filter((_, i) => i !== index));
  };

  const handleDeleteConcluida = (index) => {
    setVistoriasConcluidas(vistoriasConcluidas.filter((_, i) => i !== index));
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Vistorias Vale</h1>
        <div className="flex justify-around mb-4">
          <button
            onClick={() => setActiveTab('agendadas')}
            className={`px-4 py-2 rounded ${activeTab === 'agendadas' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Vistorias Agendadas
          </button>
          <button
            onClick={() => setActiveTab('concluidas')}
            className={`px-4 py-2 rounded ${activeTab === 'concluidas' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Vistorias Concluídas
          </button>
        </div>

        {activeTab === 'agendadas' && (
          <div>
            <h2 className="text-xl font-semibold mb-2"></h2>
            {vistoriasAgendadas.length === 0 ? (
              <p>Nenhuma vistoria agendada no momento.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 mb-4">
                {vistoriasAgendadas.map((vistoria, index) => (
                  <div key={index} className="border rounded-lg shadow-md p-4 transition transform hover:scale-105 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">{vistoria.contrato}</h3>
                      <span className="text-gray-500">{formatDateTime(vistoria.dataHora)}</span>
                    </div>
                    <p><strong>Veículo:</strong> {vistoria.veiculo} <span className="text-sm text-gray-600">({vistoria.tipo})</span></p>
                    <button
                      onClick={() => handleConcluir(index)}
                      className="absolute bottom-2 right-10 text-green-600 hover:text-green-500"
                      aria-label="Marcar como concluído"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAgendada(index)}
                      className="absolute bottom-2 right-2 text-red-600 hover:text-red-500"
                      aria-label="Excluir vistoria"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="#"
              onClick={() => setShowForm(true)}
              className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-300 ease-in-out"
              aria-label="Incluir Nova Vistoria"
            >
              Incluir Nova Vistoria
            </Link>

            {showForm && (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="dataHora">Data e Hora</label>
                  <input
                    type="datetime-local"
                    name="dataHora"
                    id="dataHora"
                    value={formData.dataHora}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="contrato">Contrato</label>
                  <input
                    type="text"
                    name="contrato"
                    id="contrato"
                    value={formData.contrato}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="veiculo">Veículo</label>
                  <input
                    type="text"
                    name="veiculo"
                    id="veiculo"
                    value={formData.veiculo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">Tipo</span>
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="tipo"
                      value="MEV"
                      checked={formData.tipo === 'MEV'}
                      onChange={handleChange}
                    />
                    MEV
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="MCA"
                      checked={formData.tipo === 'MCA'}
                      onChange={handleChange}
                    />
                    MCA
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out"
                >
                  Salvar
                </button>
              </form>
            )}
          </div>
        )}
        
        {activeTab === 'concluidas' && (
          <div>
            <h2 className="text-xl font-semibold mb-2"></h2>
            {vistoriasConcluidas.length === 0 ? (
              <p>Nenhuma vistoria concluída no momento.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 mb-4">
                {vistoriasConcluidas.map((vistoria, index) => (
                  <div key={index} className="border rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">{vistoria.contrato}</h3>
                      <span className="text-gray-500">{formatDateTime(vistoria.dataHora)}</span>
                    </div>
                    <p><strong>Veículo:</strong> {vistoria.veiculo} <span className="text-sm text-gray-600">({vistoria.tipo})</span></p>
                    <p><strong>Resultado:</strong> {vistoria.resultado}</p>
                    <p><strong>Fiscal:</strong> {vistoria.fiscal}</p>
                    <button
                      onClick={() => handleDeleteConcluida(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-500"
                      aria-label="Excluir vistoria"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))} 
              </div>
            )}
          </div>
        )}

        <Link
          to="/access/operational"
          className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-300 ease-in-out"
          aria-label="Voltar"
        >
          Voltar
        </Link>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Resultado da Vistoria</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Resultado</label>
                <select
                  name="resultado"
                  value={modalData.resultado}
                  onChange={handleModalChange}
                  required
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Selecione</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Reprovado">Reprovado</option>
                  <option value="Reapresentar">Reapresentar</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nome do Fiscal</label>
                <input
                  type="text"
                  name="fiscal"
                  value={modalData.fiscal}
                  onChange={handleModalChange}
                  required
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-2 w-full text-center text-gray-600 hover:text-gray-500"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistoriasVale;

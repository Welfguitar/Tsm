import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const CeturbPage = () => {
  const [activeTab, setActiveTab] = useState('ceturb');
  
  // Estado para armazenar os veículos ou documentos
  const [documents, setDocuments] = useState([
    { ordem: 123, placa: 'XYZ1234', vencimento: '2024-10-15', documento: 'uploads/documento123.pdf' },
    { ordem: 456, placa: 'ABC5678', vencimento: '2023-12-01', documento: 'uploads/documento456.pdf' },
  ]);

  const [formData, setFormData] = useState({
    ordem: '',
    placa: '',
    vencimento: '',
    documento: null,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.ordem || !formData.placa || !formData.vencimento || !formData.documento) {
      alert("Preencha todos os campos antes de adicionar ou atualizar o documento.");
      return;
    }

    const updatedDocuments = isUpdating 
      ? documents.map((doc) => doc.ordem === formData.ordem ? { ...formData } : doc)
      : [...documents, { ...formData }];

    setDocuments(updatedDocuments);
    setIsUpdating(false);
    setActiveTab('ceturb');

    setFormData({
      ordem: '',
      placa: '',
      vencimento: '',
      documento: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documento: e.target.files[0] });
  };

  const handleUpdate = (doc) => {
    setFormData(doc);
    setActiveTab('novo-documento');
    setIsUpdating(true);
  };

  const getCardColor = (vencimento) => {
    const now = dayjs();
    const expirationDate = dayjs(vencimento);
    const diffDays = expirationDate.diff(now, 'day');

    if (diffDays < 0) {
      return 'bg-red-500';
    } else if (diffDays <= 30) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.ordem.toString().includes(searchQuery) ||
      doc.placa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-3xl font-bold mb-8 text-center">Documentação Ceturb</h1>

        <nav className="flex justify-around mb-6 border-b-2 border-gray-300">
          <button onClick={() => setActiveTab('ceturb')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'ceturb' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300`}>
            Ceturb
          </button>
          <button onClick={() => setActiveTab('novo-documento')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'novo-documento' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300`}>
            Novo Documento
          </button>
        </nav>

        {activeTab === 'ceturb' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDocuments.map((doc, index) => (
              <div key={index} className={`p-4 rounded-lg shadow-lg ${getCardColor(doc.vencimento)}`}>
                <h3 className="text-lg font-bold mb-2">{doc.ordem}</h3>
                <p><strong>Placa:</strong> {doc.placa}</p>
                <p><strong>Vencimento:</strong> {doc.vencimento}</p>
                <div className="flex justify-between mt-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                    Ver Documento
                  </button>
                  <button onClick={() => handleUpdate(doc)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">
                    Atualizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'novo-documento' && (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Número de Ordem</label>
              <input type="text" name="ordem" value={formData.ordem} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Placa</label>
              <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Data de Vencimento</label>
              <input type="date" name="vencimento" value={formData.vencimento} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload do Documento</label>
              <input type="file" name="documento" onChange={handleFileChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
              {isUpdating ? 'Salvar Alterações' : 'Adicionar Documento'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CeturbPage;

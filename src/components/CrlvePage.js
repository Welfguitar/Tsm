import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const CrlvePage = () => {
  const [activeTab, setActiveTab] = useState('crlv-e');
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    ordem: '',
    placa: '',
    vencimento: '',
    documento: null, // Campo para armazenar o PDF
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Termo de pesquisa para filtro
  const [message, setMessage] = useState(''); // Estado para a mensagem de sucesso ou erro

  // Função para buscar os veículos/documentos salvos
  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crlv');
      setVehicles(response.data);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
    }
  };

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documento: e.target.files[0], // Armazena o arquivo PDF
    });
  };

  // Função para enviar o formulário ao backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('ordem', formData.ordem);
    data.append('placa', formData.placa);
    data.append('vencimento', formData.vencimento);
    data.append('documento', formData.documento);

    try {
      const response = await axios.post('http://localhost:5000/api/crlv/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Exibe a mensagem de sucesso
      setMessage('Documento salvo com sucesso!');
      setTimeout(() => setMessage(''), 3000); // Remove a mensagem após 3 segundos

      // Atualiza a lista de documentos
      fetchVehicles();

      // Volta para a aba "CRLV-e"
      setActiveTab('crlv-e');
    } catch (err) {
      console.error('Erro ao enviar documento:', err);
      setMessage('Erro ao salvar documento.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Função para baixar o PDF
  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/crlv/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'documento.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Erro ao baixar documento:', err);
      setMessage('Erro ao baixar documento.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Função para preencher o formulário com os dados do veículo selecionado para atualização
  const handleUpdate = (vehicle) => {
    setFormData({
      ordem: vehicle.ordem,
      placa: vehicle.placa,
      vencimento: dayjs(vehicle.vencimento).format('YYYY-MM-DD'), // Formata a data para o input de data
    });
    setActiveTab('novo-documento');
    setIsUpdating(true);
  };

  // Função para salvar as atualizações
  const handleSaveUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('ordem', formData.ordem);
    data.append('placa', formData.placa);
    data.append('vencimento', formData.vencimento);
    if (formData.documento) {
      data.append('documento', formData.documento);
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/crlv/add`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Exibe a mensagem de sucesso
      setMessage('Documento atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);

      setIsUpdating(false);
      setFormData({ ordem: '', placa: '', vencimento: '', documento: null });
      setActiveTab('crlv-e');
      fetchVehicles();
    } catch (err) {
      console.error('Erro ao atualizar documento:', err);
      setMessage('Erro ao atualizar documento.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Função para definir a cor do card de acordo com o vencimento
  const getCardColor = (vencimento) => {
    const now = dayjs(); // Data atual
    const expirationDate = dayjs(vencimento); // Data de vencimento
    const diffDays = expirationDate.diff(now, 'day'); // Diferença em dias

    if (diffDays < 0) {
      return 'bg-red-300'; // Vencido
    } else if (diffDays <= 30) {
      return 'bg-yellow-200'; // Menos de 30 dias para vencer
    } else {
      return 'bg-green-300'; // Mais de 30 dias
    }
  };

  // Filtrar veículos com base no termo de pesquisa
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.ordem.toString().includes(searchTerm) || vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url(/images/background.png)', // Certifique-se de que a imagem de fundo está no caminho correto
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg border border-gray-300 relative">
        
        {/* Exibir mensagem de sucesso ou erro */}
        {message && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {message}
          </div>
        )}

        {/* Botão Voltar no canto superior esquerdo */}
        <div className="absolute top-4 left-8">
          <Link
            to="/access/operational" // Caminho para voltar à página operacional, ajuste conforme necessário
            className="px-3 py-2 bg-blue-300 text-black rounded-lg hover:bg-pink-300 transition duration-300"
          >
            Voltar
          </Link>
        </div>

        {/* Título e abas */}
        <nav className="flex justify-around mb-6 border-b-2 border-gray-300">
          <button onClick={() => setActiveTab('crlv-e')} className={`flex-1 py-1 text-center font-semibold ${activeTab === 'crlv-e' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300 text-sm`}>
            CRLV-e
          </button>
          <button onClick={() => setActiveTab('novo-documento')} className={`flex-1 py-1 text-center font-semibold ${activeTab === 'novo-documento' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300 text-sm`}>
            Novo Documento
          </button>
        </nav>

        {/* Campo de Pesquisa */}
        {activeTab === 'crlv-e' && (
          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Nº de Ordem ou Placa"
              className="border px-4 py-2 rounded-l-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg text-sm">
              Pesquisar
            </button>
          </div>
        )}

        {/* Conteúdo da aba selecionada */}
        <div>
          {activeTab === 'crlv-e' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Cards mais compactos */}
              {/* Lista de veículos filtrados */}
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle._id} className={`p-2 rounded-lg shadow-sm text-sm max-w-xs ${getCardColor(vehicle.vencimento)}`}>
                  <h3 className="font-bold mb-1"> {vehicle.ordem}</h3>
                  <p>Placa: {vehicle.placa}</p>
                  <p>Vencimento: {dayjs(vehicle.vencimento).format('DD/MM/YYYY')}</p>
                  <div className="flex justify-between mt-2">
                    <button onClick={() => handleDownload(vehicle._id)} className="px-2 py-1 bg-blue-400 text-white rounded-md hover:bg-pink-500 transition duration-300 text-xs">
                      Baixar
                    </button>
                    <button onClick={() => handleUpdate(vehicle)} className="px-2 py-1 bg-blue-400 text-white rounded-md hover:bg-pink-500 transition duration-300 text-xs">
                      Atualizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-3">{isUpdating ? 'Atualizar Documento' : 'Novo Documento'}</h2>
              <form onSubmit={isUpdating ? handleSaveUpdate : handleFormSubmit}>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Número de Ordem</label>
                  <input
                    type="text"
                    name="ordem"
                    value={formData.ordem}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                    placeholder="Digite o número de ordem"
                    disabled={isUpdating} // Desabilita o campo quando em modo de atualização
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Placa do Veículo</label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                    placeholder="Digite a placa do veículo"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Data de Vencimento</label>
                  <input
                    type="date"
                    name="vencimento"
                    value={formData.vencimento}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Upload do Documento</label>
                  <input type="file" onChange={handleFileChange} className="w-full px-2 py-1 border rounded-lg text-sm" />
                </div>
                <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm">
                  {isUpdating ? 'Salvar Alterações' : 'Adicionar Documento'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrlvePage;

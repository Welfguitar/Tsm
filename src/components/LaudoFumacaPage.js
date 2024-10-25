import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const LaudoFumacaPage = () => {
  const [laudos, setLaudos] = useState([]);
  const [formData, setFormData] = useState({
    vencimento: '',
    tipoLaudo: '',
    obs: '',
    laudo: null, // Campo para armazenar o PDF
    id: '', // ID para atualizações
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Termo de pesquisa para filtro
  const [message, setMessage] = useState(''); // Estado para a mensagem de sucesso ou erro
  const [activeTab, setActiveTab] = useState('laudos'); // Aba ativa

  // Função para buscar os laudos salvos
  const fetchLaudos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/laudo-fumaca');
      setLaudos(response.data);
    } catch (err) {
      console.error('Erro ao buscar laudos:', err);
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
      laudo: e.target.files[0], // Armazena o arquivo PDF
    });
  };

  // Função para enviar o formulário ao backend (salvar novo laudo)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('vencimento', formData.vencimento);
    data.append('tipoLaudo', formData.tipoLaudo);
    data.append('obs', formData.obs);
    data.append('laudo', formData.laudo);

    try {
      const response = await axios.post('http://localhost:5000/api/laudo-fumaca/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Laudo salvo com sucesso!');
      setTimeout(() => setMessage(''), 3000);

      fetchLaudos();
      setActiveTab('laudos');
    } catch (err) {
      console.error('Erro ao enviar laudo:', err);
      setMessage('Erro ao salvar laudo.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Função para baixar o PDF
  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/laudo-fumaca/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'laudo.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Erro ao baixar laudo:', err);
      setMessage('Erro ao baixar laudo.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Função para atualizar o laudo existente
  const handleUpdate = (laudo) => {
    setFormData({
      vencimento: dayjs(laudo.vencimento).format('YYYY-MM-DD'), // Formata a data para o input de data
      tipoLaudo: laudo.tipoLaudo,
      obs: laudo.obs,
      laudo: null, // Não carregamos o PDF existente
      id: laudo._id, // Guarda o ID do laudo
    });
    setIsUpdating(true); // Define que estamos atualizando
    setActiveTab('novo-laudo'); // Muda para a aba de edição do laudo
  };

  // Função para salvar as atualizações feitas em um laudo existente
  const handleSaveUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('vencimento', formData.vencimento);
    data.append('tipoLaudo', formData.tipoLaudo);
    data.append('obs', formData.obs);
    if (formData.laudo) {
      data.append('laudo', formData.laudo); // Apenas se houver um novo PDF
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/laudo-fumaca/update/${formData.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Laudo atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
      setIsUpdating(false); // Sai do modo de atualização
      setActiveTab('laudos'); // Volta para a aba de laudos
      fetchLaudos(); // Atualiza a lista de laudos
    } catch (err) {
      console.error('Erro ao atualizar laudo:', err);
      setMessage('Erro ao atualizar laudo.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Função para deletar um laudo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/laudo-fumaca/delete/${id}`);
      setMessage('Laudo excluído com sucesso!');
      setTimeout(() => setMessage(''), 3000);
      fetchLaudos(); // Atualiza a lista de laudos após exclusão
    } catch (err) {
      console.error('Erro ao deletar laudo:', err);
      setMessage('Erro ao excluir laudo.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

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

  useEffect(() => {
    fetchLaudos();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url(/images/background.png)', // Adiciona imagem de fundo
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg border border-gray-300 relative">
        
        {/* Exibir mensagem de sucesso ou erro diretamente na tela */}
        {message && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
            {message}
          </div>
        )}

        {/* Botão Voltar no canto superior esquerdo */}
        <div className="absolute top-4 left-8">
          <button
            onClick={() => window.history.back()}
            className="px-3 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Voltar
          </button>
        </div>

        {/* Título e abas */}
        <nav className="flex justify-around mb-6 border-b-2 border-gray-300">
          <button onClick={() => setActiveTab('laudos')} className={`flex-1 py-1 text-center font-semibold ${activeTab === 'laudos' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300 text-sm`}>
            Laudos
          </button>
          <button onClick={() => setActiveTab('novo-laudo')} className={`flex-1 py-1 text-center font-semibold ${activeTab === 'novo-laudo' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300 text-sm`}>
            Novo Laudo
          </button>
        </nav>

        {/* Campo de Pesquisa */}
        {activeTab === 'laudos' && (
          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Pesquisar laudos..."
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
          {activeTab === 'laudos' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {laudos.filter(laudo => 
                laudo.tipoLaudo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                laudo.obs.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((laudo) => (
                <div key={laudo._id} className={`p-2 rounded-lg shadow-sm text-sm max-w-xs ${getCardColor(laudo.vencimento)}`}>
                  <h3 className="font-bold mb-1">Tipo de Laudo: {laudo.tipoLaudo}</h3>
                  <p>Vencimento: {dayjs(laudo.vencimento).format('DD/MM/YYYY')}</p>
                  <p>Obs: {laudo.obs}</p>
                  <div className="flex justify-between mt-2">
                    <button onClick={() => handleDownload(laudo._id)} className="px-2 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition duration-300 text-xs">
                      Baixar
                    </button>
                    <button onClick={() => handleUpdate(laudo)} className="px-2 py-1 bg-green-400 text-white rounded-md hover:bg-green-500 transition duration-300 text-xs">
                      Atualizar
                    </button>
                    <button onClick={() => handleDelete(laudo._id)} className="px-2 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 transition duration-300 text-xs">
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-3">{isUpdating ? 'Atualizar Laudo' : 'Novo Laudo'}</h2>
              <form onSubmit={isUpdating ? handleSaveUpdate : handleFormSubmit}>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Vencimento do Laudo</label>
                  <input
                    type="date"
                    name="vencimento"
                    value={formData.vencimento}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Tipo de Laudo</label>
                  <select
                    name="tipoLaudo"
                    value={formData.tipoLaudo}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  >
                    <option value="">Selecione</option>
                    <option value="Vale/Arcelor">Vale/Arcelor</option>
                    <option value="Samarco">Samarco</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Observação</label>
                  <input
                    type="text"
                    name="obs"
                    value={formData.obs}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                    placeholder="Digite observações"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-600 text-sm">Anexar Laudo (PDF)</label>
                  <input type="file" onChange={handleFileChange} className="w-full px-2 py-1 border rounded-lg text-sm" />
                </div>
                <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm">
                  {isUpdating ? 'Salvar Alterações' : 'Adicionar Laudo'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaudoFumacaPage;

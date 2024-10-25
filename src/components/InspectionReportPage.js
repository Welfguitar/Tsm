import React, { useState } from 'react';

const InspectionReportPage = () => {
  const [activeTab, setActiveTab] = useState('novoRelato'); // Aba ativa
  const [relatosPendentes, setRelatosPendentes] = useState([]); // Relatos Pendentes
  const [relatosConcluidos, setRelatosConcluidos] = useState([]); // Relatos Concluídos
  const [formData, setFormData] = useState({
    dateTime: '',
    motorista: '',
    veiculo: '',
    descricao: '',
    fotos: null, // Campo para anexar fotos
  });
  const [parecer, setParecer] = useState(''); // Estado do campo "Parecer"
  const [message, setMessage] = useState(''); // Estado para mensagens de sucesso ou erro
  const [selectedRelato, setSelectedRelato] = useState(null); // Relato selecionado para o modal
  const [fullscreenImage, setFullscreenImage] = useState(null); // Controle para imagem em tela cheia

  // Função para lidar com mudanças nos campos do formulário
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
      fotos: e.target.files, // Aceita múltiplos arquivos de imagem
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Criando um novo relato a partir dos dados do formulário
    const novoRelato = {
      id: relatosPendentes.length + 1, // Gera um ID simples (apenas para este exemplo)
      dateTime: formData.dateTime,
      motorista: formData.motorista,
      veiculo: formData.veiculo,
      descricao: formData.descricao,
      fotos: formData.fotos,
      parecer: '', // Inicialmente, o parecer é vazio
    };

    // Adiciona o novo relato à lista de relatos pendentes
    setRelatosPendentes([...relatosPendentes, novoRelato]);

    // Limpa o formulário e exibe a mensagem de sucesso
    setMessage('Relato enviado com sucesso!');
    setTimeout(() => setMessage(''), 3000);
    setFormData({
      dateTime: '',
      motorista: '',
      veiculo: '',
      descricao: '',
      fotos: null,
    });

    // Alterna para a aba de relatos pendentes
    setActiveTab('relatosPendentes');
  };

  // Função para abrir o modal com o relato completo
  const openModal = (relato) => {
    setSelectedRelato(relato);
    setParecer(relato.parecer || ''); // Inicializa o parecer existente (caso o relato já tenha um parecer)
  };

  // Função para fechar o modal
  const closeModal = () => {
    setSelectedRelato(null);
  };

  // Função para abrir uma imagem em tela cheia
  const openFullscreenImage = (image) => {
    setFullscreenImage(image);
  };

  // Função para fechar a imagem em tela cheia
  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  // Função para concluir o relato (mover para Relatos Concluídos e salvar parecer)
  const concluirRelato = (relato) => {
    // Adiciona o parecer ao relato
    const relatoConcluido = {
      ...relato,
      parecer: parecer, // Salva o parecer
    };

    // Remove o relato da lista de pendentes
    const novosRelatosPendentes = relatosPendentes.filter((r) => r.id !== relato.id);
    setRelatosPendentes(novosRelatosPendentes);

    // Adiciona o relato à lista de concluidos
    setRelatosConcluidos([...relatosConcluidos, relatoConcluido]);

    // Fecha o modal
    closeModal();

    // Alterna para a aba de relatos concluídos
    setActiveTab('relatosConcluidos');
  };

  // Função para renderizar o conteúdo de acordo com a aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'novoRelato':
        return (
          <div>
            <h2 className="text-lg font-bold mb-3"></h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-gray-600 text-sm">Data e Hora</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg text-sm"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-600 text-sm">Motorista</label>
                <input
                  type="text"
                  name="motorista"
                  value={formData.motorista}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg text-sm"
                  placeholder="Nome do motorista"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-600 text-sm">Veículo</label>
                <input
                  type="text"
                  name="veiculo"
                  value={formData.veiculo}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg text-sm"
                  placeholder="Identificação do veículo"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-600 text-sm">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg text-sm"
                  placeholder="Descreva o problema..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="block text-gray-600 text-sm">Anexar Fotos</label>
                <input
                  type="file"
                  name="fotos"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-2 py-1 border rounded-lg text-sm"
                />
              </div>

              <button className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm">
                Enviar Relato
              </button>
            </form>
          </div>
        );
      case 'relatosPendentes':
        return (
          <div>
            <h2 className="text-lg font-bold mb-3"></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatosPendentes.map((relato) => (
                <div
                  key={relato.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-100 cursor-pointer"
                  onClick={() => openModal(relato)}
                >
                  <h3 className="font-bold">Veículo: {relato.veiculo}</h3>
                  <p>Motorista: {relato.motorista}</p>
                  <p>Data: {new Date(relato.dateTime).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'relatosConcluidos':
        return (
          <div>
            <h2 className="text-lg font-bold mb-3"></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatosConcluidos.map((relato) => (
                <div
                  key={relato.id}
                  className="p-4 border rounded-lg shadow-sm bg-green-100 cursor-pointer"
                  onClick={() => openModal(relato)} // Reutiliza o modal para Relatos Concluídos
                >
                  <h3 className="font-bold">Veículo: {relato.veiculo}</h3>
                  <p>Motorista: {relato.motorista}</p>
                  <p>Data: {new Date(relato.dateTime).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
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
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg border border-gray-300 relative">
        {/* Exibir mensagem de sucesso ou erro */}
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

        {/* Título e Abas */}
        <nav className="flex justify-around mb-6 border-b-2 border-gray-300">
          <button
            onClick={() => setActiveTab('novoRelato')}
            className={`flex-1 py-1 text-center font-semibold ${activeTab === 'novoRelato' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300 text-sm`}
          >
            Novo Relato
          </button>
          <button
            onClick={() => setActiveTab('relatosPendentes')}
            className={`flex-1 py-1 text-center font-semibold ${activeTab === 'relatosPendentes' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300 text-sm`}
          >
            Relatos Pendentes
          </button>
          <button
            onClick={() => setActiveTab('relatosConcluidos')}
            className={`flex-1 py-1 text-center font-semibold ${activeTab === 'relatosConcluidos' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'} transition duration-300 text-sm`}
          >
            Relatos Concluídos
          </button>
        </nav>

        {/* Conteúdo das Abas */}
        <div>{renderContent()}</div>

        {/* Modal para exibir detalhes do relato */}
        {selectedRelato && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="font-bold text-xl mb-4">Detalhes do Relato</h3>
              <p><strong>Motorista:</strong> {selectedRelato.motorista}</p>
              <p><strong>Veículo:</strong> {selectedRelato.veiculo}</p>
              <p><strong>Data e Hora:</strong> {new Date(selectedRelato.dateTime).toLocaleString()}</p>
              <p><strong>Descrição:</strong> {selectedRelato.descricao}</p>
              {selectedRelato.fotos && (
                <div className="mt-4">
                  <p className="font-bold">Fotos anexadas:</p>
                  <div className="flex flex-wrap">
                    {Array.from(selectedRelato.fotos).map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Foto ${index + 1}`}
                        className="w-32 h-32 object-cover mr-2 mb-2 cursor-pointer"
                        onClick={() => openFullscreenImage(URL.createObjectURL(file))} // Abre a imagem em tela cheia
                      />
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'relatosPendentes' && (
                <div className="mt-4">
                  <label className="block text-gray-600 text-sm mb-2">Parecer</label>
                  <textarea
                    value={parecer}
                    onChange={(e) => setParecer(e.target.value)}
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                    placeholder="Digite seu parecer..."
                  ></textarea>
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Fechar
                </button>
                {activeTab === 'relatosPendentes' && (
                  <button
                    onClick={() => concluirRelato(selectedRelato)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Concluir Relato
                  </button>
                )}
              </div>
              {activeTab === 'relatosConcluidos' && selectedRelato.parecer && (
                <div className="mt-4">
                  <p><strong>Parecer:</strong> {selectedRelato.parecer}</p> {/* Exibe o parecer no modal de Relatos Concluídos */}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Imagem em tela cheia */}
        {fullscreenImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-full" />
            <button
              onClick={closeFullscreenImage}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionReportPage;

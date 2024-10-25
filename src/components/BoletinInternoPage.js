// BoletimInternoPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../logo.jpg'; // Caminho relativo para o SVG


// Função para formatar a data no padrão dd/mm/aaaa hh:mm
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const BoletimInternoPage = () => {
  const navigate = useNavigate();
  const [boletins, setBoletins] = useState([]);
  const [selectedBoletim, setSelectedBoletim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(); // Declaração corret

  const handleDelete = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir este boletim?");
    if (!confirm) return;
  
    try {
      // Enviar requisição DELETE para o backend
      await axios.delete(`http://localhost:5000/api/boletins/${id}`);
  
      // Atualizar a lista de boletins após a exclusão
      setBoletins(boletins.filter((boletim) => boletim._id !== id));
      alert("Boletim excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir boletim:", error);
      alert("Ocorreu um erro ao excluir o boletim.");
    }
  };

  const handlePrint = () => {
    if (modalRef.current) {
      const printContent = modalRef.current.innerHTML; // Captura o conteúdo do modal
      const printWindow = window.open('', '_blank'); // Abre uma nova janela em branco
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Boletim</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2, h3 { margin-bottom: 10px; }
              p { margin: 5px 0; }
              img { max-width: 100%; height: auto; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            </style>
          </head>
          <body onload="window.print();window.close()">
            ${printContent} <!-- Insere o conteúdo do modal na nova janela -->
          </body>
        </html>
      `);
      printWindow.document.close(); // Finaliza a escrita do documento
    }
  };
  

  // Buscar boletins do backend
  useEffect(() => {
    const fetchBoletins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/boletins');
        setBoletins(response.data);
      } catch (error) {
        console.error('Erro ao buscar boletins:', error);
      }
    };
    fetchBoletins();
  }, []);

  const handleOpenModal = (boletim) => {
    setSelectedBoletim(boletim);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation(); // Impede que o clique no botão abra o modal
    handleDelete(id); // Chama a função de exclusão
  };
  

  const handleCloseModal = () => {
    setSelectedBoletim(null);
    setIsModalOpen(false);
  };

  const handleBack = () => {
    navigate('/access/operational');
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
 <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg border border-gray-300">
  <div className="flex justify-center mb-6">
    <h1 className="text-2xl font-bold">Boletim Interno</h1>
  </div>

  <div className="flex justify-between">
  <button
    onClick={handleBack}
    className="py-4 px-6 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
    style={{ position: 'relative', top: '-26px' }}
  >
    Voltar
  </button>
</div>


  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
  {boletins.map((boletim) => (
    <div
      key={boletim._id}
      className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition relative"
    >
      {/* Envolvendo o conteúdo clicável com uma div */}
      <div
        className="cursor-pointer"
        onClick={() => handleOpenModal(boletim)}
      >
        <h2 className="text-lg font-bold">{boletim.numeroOrdem}</h2>
        <p>Motorista: {boletim.motorista}</p>
        <p>Data: {formatDateTime(boletim.dataOcorrencia)}</p>
      </div>

      {/* Botão de Excluir (fora do conteúdo clicável) */}
      <button
        onClick={(e) => handleDeleteClick(e, boletim._id)}
        className="absolute top-2 right-2 py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Excluir
      </button>
    </div>
  ))}
</div>

        {/* Modal com todos os detalhes */}
        {isModalOpen && selectedBoletim && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
<div
  ref={modalRef} // Adicionando a referência
  className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full overflow-auto max-h-[90vh] border-2 border-gray-400"
>
{/* Adicionando a logo no topo do modal */}
              <div className="flex justify-center mb-4">
                <img src={Logo} alt="Logo" className="h-16" />
              </div>
              <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-widest">
                Boletim de Ocorrência Interno <p><strong></strong> {selectedBoletim.numeroBoletim}</p>
              </h2>

              <div className="border-t border-gray-300 py-4">
                <h3 className="text-lg font-bold">Informações Gerais</h3>
                <p><strong>Número do Boletim:</strong> {selectedBoletim.numeroBoletim}</p>
                <p><strong>Data da Ocorrência:</strong> {formatDateTime(selectedBoletim.dataOcorrencia)}</p>
                <p><strong>Local do Sinistro:</strong> {selectedBoletim.localSinistro}</p>
                <p><strong>Motorista:</strong> {selectedBoletim.motorista}</p>
                <p><strong>Número de Ordem:</strong> {selectedBoletim.numeroOrdem}</p>
                <p><strong>Placa:</strong> {selectedBoletim.placa}</p>
                <p><strong>Descrição das Avarias:</strong> {selectedBoletim.descricaoAvarias}</p>
              </div>

              <div className="border-t border-gray-300 py-4">
                <h3 className="text-lg font-bold">Fotos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedBoletim.fotos.map((foto, index) => (
                    <a key={index} href={`http://localhost:5000/${foto}`} target="_blank" rel="noopener noreferrer">
                      <img
                        src={`http://localhost:5000/${foto}`}
                        alt={`Foto ${index + 1}`}
                        className="w-full rounded border cursor-pointer"
                      />
                    </a>
                  ))}
                </div>
              </div>
          
              {selectedBoletim.nomeTerceiro && (
                <div className="border-t border-gray-300 py-4">
                  <h3 className="text-lg font-bold">Terceiro Envolvido</h3>
                  <p><strong>Nome:</strong> {selectedBoletim.nomeTerceiro}</p>
                  <p><strong>Telefone:</strong> {selectedBoletim.telefoneTerceiro}</p>
                  <p><strong>Marca/Modelo:</strong> {selectedBoletim.marcaModeloVeiculo}</p>
                  <p><strong>Placa:</strong> {selectedBoletim.placaTerceiro}</p>
                  <p><strong>Descrição das Avarias do Terceiro:</strong> {selectedBoletim.descricaoAvariasTerceiro}</p>
                </div>
              )}

{selectedBoletim.fotosTerceiro.length > 0 && (
                <div className="border-t border-gray-300 py-4">
                  <h3 className="text-lg font-bold">Fotos do Terceiro</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedBoletim.fotosTerceiro.map((foto, index) => (
                      <a key={index} href={`http://localhost:5000/${foto}`} target="_blank" rel="noopener noreferrer">
                        <img
                          src={`http://localhost:5000/${foto}`}
                          alt={`Foto Terceiro ${index + 1}`}
                          className="w-full rounded border cursor-pointer"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-300 py-4">
                <h3 className="text-lg font-bold">Arquivos</h3>
                {selectedBoletim.termoResponsabilidade && (
                  <p>
                    <a
                      href={`http://localhost:5000/${selectedBoletim.termoResponsabilidade}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Termo do Motorista (PDF)
                    </a>
                  </p>
                )}
                {selectedBoletim.boletimTransito && (
                  <p>
                    <a
                      href={`http://localhost:5000/${selectedBoletim.boletimTransito}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Boletim de Ocorrência de Trânsito (PDF)
                    </a>
                  </p>
                )}
              </div>

              <div className="border-t border-gray-300 py-4">
                <h3 className="text-lg font-bold">Observações</h3>
                <p>{selectedBoletim.observacoes}</p>
              </div>

              {selectedBoletim.assinaturaVistoriador && (
                <div className="border-t border-gray-300 py-4">
                  <h3 className="text-lg font-bold">Assinatura do Vistoriador</h3>
                  <img
                    src={selectedBoletim.assinaturaVistoriador}
                    alt="Assinatura"
                    className="w-full rounded border"
                  />
                </div>
              )}

<div className="mt-4 flex justify-end space-x-4">
  <button
    onClick={handleCloseModal}
    className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
  >
    Fechar
  </button>
  <button
    onClick={handlePrint}
    className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
  >
    Imprimir
  </button>
</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoletimInternoPage;

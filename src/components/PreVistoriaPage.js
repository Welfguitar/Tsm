import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaEdit, FaTrash } from 'react-icons/fa';

const questions = [{ id: 1, text: 'POSSUI LEITORA DE CARTÃO?', status: '' },
  { id: 2, text: 'POSSUI ADESIVO DO CONTROLE DE ACESSO?', status: '' },
  { id: 3, text: 'POSSUI TELEMETRIA - SGTRACK?', status: '' },
  { id: 4, text: 'POSSUI SENSOR DE FADIGA E SONOLÊNCIA?', status: '' },
  { id: 5, text: 'O SENSOR DE RÉ ESTÁ FUNCIONANDO?', status: '' },
  { id: 6, text: 'AS LÂMPADAS DO SALÃO ESTÃO FUNCIONANDO?', status: '' },
  { id: 7, text: 'AS LÂMPADAS DO MOTORISTA ESTÃO FUNCIONANDO?', status: '' },
  { id: 8, text: 'LUZES DE AVISO E ADVERTÊNCIA NO PAINEL ESTÃO APAGADAS?', status: '' },
  { id: 9, text: 'O LIMPADOR DE PARA-BRISA E O ESGUICHO DE ÁGUA ESTÃO FUNCIONANDO?', status: '' },
  { id: 10, text: 'A BUZINA ESTÁ FUNCIONANDO?', status: '' },
  { id: 11, text: 'POSSUI ADESIVO CETURB INTERNO?', status: '' },
  { id: 12, text: 'POSSUI INDICADOR DE QUANTIDADE DE PASSAGEIROS?', status: '' },
  { id: 13, text: 'POSSUI ADESIVO DO PLANO DE MANUTENÇÃO DE FERROSOS?', status: '' },
  { id: 14, text: 'POSSUI ADESIVO DE MANETE NA JANELA DO MOTORISTA?', status: '' },
  { id: 15, text: 'POSSUI ADESIVOS DE VÁLVULA DE PORTA?', status: '' },
  { id: 16, text: 'POSSUI PLACA DE PORTA INTERDITADA?', status: '' },
  { id: 17, text: 'POSSUI PLACA DE ELEVADOR INTERDITADO?', status: '' },
  { id: 18, text: 'POSSUI PLACA DE USO OBRIGATÓRIO DO CINTO DE SEGURANÇA?', status: '' },
  { id: 19, text: 'POSSUI EXTINTOR VÁLIDO, COM LACRE E PRESSURIZADO?', status: '' },
  { id: 20, text: 'OS BALAÚSTRES (CORRIMÃOS) ESTÃO EM BOAS CONDIÇÕES?', status: '' },
  { id: 21, text: 'O ENCOSTO DE CABEÇA DOS PASSAGEIROS ESTÃO EM BOAS CONDIÇÕES?', status: '' },
  { id: 22, text: 'AS BASES DE SUSTENTAÇÃO DAS POLTRONAS ESTÃO LIVRES DE TRINCAS?', status: '' },
  { id: 23, text: 'A POLTRONA DO MOTORISTA E O  ENCOSTO DE CABEÇA ESTÃO EM BOAS CONDIÇÕES?', status: '' },
  { id: 24, text: 'O AR-CONDICIONADO PARA O MOTORISTA ESTÁ FUNCIONANDO?', status: '' },
  { id: 25, text: 'O AR-CONDICIONADO DO SALÃO ESTÁ FUNCIONANDO?', status: '' },
  { id: 26, text: 'POSSUI DIFUSORES DE AR-CONDICIONADO EM BOAS CONDIÇÕES?', status: '' },
  { id: 27, text: 'TODOS OS CINTOS DE SEGURANÇA ESTÃO FUNCIONANDO?', status: '' },
  { id: 28, text: 'A CAPOTARIA ESTÁ EM BOAS CONDIÇÕES?', status: '' },
  { id: 29, text: 'A POLTRONA DO CADEIRANTE FOI REMOVIDA?', status: '' },
  { id: 30, text: 'POSSUI PLACA DE 1ª POLTRONA INTERDITADA?', status: '' },
  { id: 31, text: 'AS ESTÃO JANELAS TRAVADAS EM 15CM DE ABERTURA?', status: '' },
  { id: 32, text: 'POSSUI KIT COMPLETO? TRIÂNGULO, CHAVE DE RODA, MACACO, CONES, COLETES E CALÇO.', status: '' },
  { id: 33, text: 'POSSUI VALEFORMS?', status: '' },
  { id: 34, text: 'POSSUI AGENDAMENTO MEV?', status: '' },
  { id: 35, text: 'POSSUI CETURB VÁLIDO?', status: '' },
  { id: 36, text: 'POSSUI LAUDO DE FUMAÇA E ADESIVO NO PARABRISA?', status: '' },
  { id: 37, text: 'POSSUI CRONOTACÓGRAFO?', status: '' },
  { id: 38, text: 'POSSUI CADERNO DE MANUTENÇÃO?', status: '' },
  { id: 39, text: 'POSSUI CRLV ATUALIZADO?', status: '' },
  { id: 40, text: 'POSSUI PLANO DE MANUTENÇÃO E ORDEM DE SERVIÇO ASSINADOS?', status: '' },
  { id: 41, text: 'POSSUI ART?', status: '' },
  { id: 42, text: 'POSSUI RELATÓRIO DE TELEMETRIA?', status: '' },
  { id: 43, text: 'O PASSAPORTE DO MOTORISTA ESTÁ VÁLIDO?', status: '' },
  { id: 44, text: 'O ITINERÁRIO ESTÁ FUNCIONANDO E CONFIGURADO?', status: '' },
  { id: 45, text: 'AS LÂMPADAS DE FAROL ALTO E BAIXO ESTÃO FUNCIONANDO?', status: '' },
  { id: 46, text: 'AS LÂMPADAS DE SETAS DIANTEIRAS, TRASEIRAS E LATERAIS ESTÃO FUNCIONANDO?', status: '' },
  { id: 47, text: 'AS LÂMPADAS DO FAROL DE MILHA ESTÃO FUNCIONANDO?', status: '' },
  { id: 48, text: 'AS LÂMPADAS DE FREIO E A ESTOPA DE FREIO ESTÃO FUNCIONANDO?', status: '' },
  { id: 49, text: 'A LÂMPADA DO BREAK LIGHT ESTÁ FUNCIONANDO?', status: '' },
  { id: 50, text: 'AS LAMPADAS DE RÉ E A SIRENE DE RÉ ESTÃO FUNCIONANDO?', status: '' },
  { id: 51, text: 'AS LÂMPADAS DE POSIÇÃO SUPERIORES (VIGIA) ESTÃO FUNCIONANDO?', status: '' },
  { id: 52, text: 'FAIXAS REFLETIVAS ESTÃO PADRONIZADAS E EM BOAS CONDIÇÕES?', status: '' },
  { id: 53, text: 'POSSUI OS ADESIVOS DE LOGOMARCA DA EMPRESA CONTRATANTE?', status: '' },
  { id: 54, text: 'POSSUI OS 3 ADESIVOS DA CETURB EXTERNOS?', status: '' },
  { id: 55, text: 'POSSUI O ADESIVO DE VELOCIDADE CONTROLADA?', status: '' },
  { id: 56, text: 'POSSUI OS 3 ADESIVOS DE PONTO CEGO?', status: '' },
  { id: 57, text: 'POSSUI LOGOMARCAS NAS LATERAIS, TRASEIRA E TELEFONE DA EMPRESA?', status: '' },
  { id: 58, text: 'POSSUI Nº DE ORDEM?', status: '' },
  { id: 59, text: 'AS PLACAS ESTÃO LEGÍVEIS?', status: '' },
  { id: 60, text: 'POSSUI ESTEPE?', status: '' },
  { id: 61, text: 'POSSUI DIFUSOR DE TORQUE (DIPS) EM TODAS AS RODAS?', status: '' },
  { id: 62, text: 'POSSUI BATENTE DE MOLAS?', status: '' },
  { id: 63, text: 'O VEÍCULO LIVRE DE VAZAMENTO DE ÓLEO?', status: '' },
  { id: 64, text: 'O VEÍCULO LIVRE DE VAZAMENTO DE AR? (VERIFICAR MANETE, FREIO E EMBREAGEM)', status: '' },
  { id: 65, text: 'O VEÍCULO ESTÁ LIVRE DE DANOS NA LATARIA/AVARIAS?', status: '' },
  { id: 66, text: 'O FREIO MOTOR ESTÁ FUNCIONANDO?', status: '' },
  { id: 67, text: 'AS MOLAS DO VEÍCULO ESTÃO EM BOAS CONDIÇÕES E LIVRES DE TRINCAS?', status: '' },
  { id: 68, text: 'O VEÍCULO ESTÁ LIVRE DE FOLGAS NA BARRA DE DIREÇÃO, CARDAN E ETC? ', status: '' },
  { id: 68, text: 'POSSUI BOTÃO/VALVULA EXTERNA PARA FECHAR A PORTA?', status: '' },
  { id: 69, text: 'PNEUS EM BOAS CONDIÇÕES E DESENHO DOS PNEUS IGUAIS?', status: '' },
  { id: 70, text: 'ESCAPAMENTO DIRECIONADO PARA OS LADOS OU PARA CIMA? (PADRÃO MCA)', status: '' },];

const PreVistoriaPage = () => {
  const [activeTab, setActiveTab] = useState('nova');
  const [responses, setResponses] = useState(questions.map(q => ({ ...q, status: '' })));
  const [formData, setFormData] = useState({
    vistoriador: '',
    veiculo: '',
    data: '',
    contrato: '',
    hodometro: '',
  });
  const [completedChecks, setCompletedChecks] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(null);

  const handleResponseChange = (id, newStatus) => {
    setResponses(responses.map(q => (q.id === id ? { ...q, status: newStatus } : q)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCompletedChecks([...completedChecks, { ...formData, responses }]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ vistoriador: '', veiculo: '', data: '', contrato: '', hodometro: '' });
    setResponses(questions.map(q => ({ ...q, status: '' })));
    setActiveTab('concluidas');
  };

  const openModal = (check) => {
    setSelectedCheck(check);
  };

  const closeModal = () => {
    setSelectedCheck(null);
  };

  const handleEdit = (check) => {
    setFormData(check);
    setResponses(check.responses);
    setActiveTab('nova');
    setCompletedChecks(completedChecks.filter(c => c !== check)); // Remove from completed
  };

  const handleDelete = (check) => {
    setCompletedChecks(completedChecks.filter(c => c !== check));
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-100">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-700" style={{ fontFamily: 'Poppins, sans-serif' }}>Pré-Vistoria</h1>
        
        <div className="flex justify-around mb-6">
          <button onClick={() => setActiveTab('nova')} className={`flex-1 px-4 py-2 rounded-lg ${activeTab === 'nova' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} transition-all duration-300`}>Pré-Vistoria</button>
          <button onClick={() => setActiveTab('concluidas')} className={`flex-1 px-4 py-2 rounded-lg ${activeTab === 'concluidas' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} transition-all duration-300`}>Pré-Vistorias Concluídas</button>
        </div>

        {activeTab === 'nova' && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-4">Iniciar Pré-Vistoria</h2>
            <div className="mb-4">
              <input type="text" name="vistoriador" value={formData.vistoriador} onChange={handleChange} placeholder="Vistoriador" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-4">
              <input type="text" name="veiculo" value={formData.veiculo} onChange={handleChange} placeholder="Veículo" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-4">
              <input type="date" name="data" value={formData.data} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-4">
              <input type="text" name="contrato" value={formData.contrato} onChange={handleChange} placeholder="Contrato" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-4">
              <input type="number" name="hodometro" value={formData.hodometro} onChange={handleChange} placeholder="Hodômetro" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            {responses.map(question => (
              <div key={question.id} className="mb-4">
                <span className="font-semibold text-lg">{question.text}</span>
                <div className="flex justify-around mt-2">
                  {['conforme', 'naoConforme', 'naoSeAplica'].map(option => (
                    <label key={option} className="flex items-center">
                      <input type="radio" value={option} checked={question.status === option} onChange={() => handleResponseChange(question.id, option)} className="mr-2 hidden" />
                      <span className={`flex items-center p-2 rounded-lg border ${question.status === option ? 'border-blue-600' : 'border-gray-300'}`}>
                        {option === 'conforme' && <FaCheckCircle className={`text-lg ${question.status === option ? 'text-green-600' : 'text-gray-500'}`} />}
                        {option === 'naoConforme' && <FaTimesCircle className={`text-lg ${question.status === option ? 'text-red-600' : 'text-gray-500'}`} />}
                        {option === 'naoSeAplica' && <FaQuestionCircle className={`text-lg ${question.status === option ? 'text-yellow-600' : 'text-gray-500'}`} />}
                        <span className="ml-2">{option === 'conforme' ? 'Conforme' : option === 'naoConforme' ? 'Não Conforme' : 'Não Se Aplica'}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg transition duration-300 hover:bg-blue-700">Salvar</button>
          </form>
        )}

        {activeTab === 'concluidas' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Concluídas</h2>
            <ul className="space-y-2">
              {completedChecks.map((check, index) => (
                <li key={index} onClick={() => openModal(check)} className="border border-gray-300 p-4 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition duration-300 cursor-pointer">
                  <span>{check.veiculo}</span>
                  <span>{check.data}</span>
                  <span>{check.contrato}</span>
                  <div className="flex space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(check); }} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(check); }} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/access/operational" className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-300 ease-in-out" aria-label="Voltar">Voltar</Link>
      </div>

      {selectedCheck && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg overflow-y-auto max-h-[80%]">
            <h2 className="text-2xl font-semibold mb-4">Detalhes da Pré-Vistoria</h2>
            <p><strong>Vistoriador:</strong> {selectedCheck.vistoriador}</p>
            <p><strong>Veículo:</strong> {selectedCheck.veiculo}</p>
            <p><strong>Data:</strong> {selectedCheck.data}</p>
            <p><strong>Contrato:</strong> {selectedCheck.contrato}</p>
            <p><strong>Hodômetro:</strong> {selectedCheck.hodometro}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold"></h3>
              {selectedCheck.responses.map((response, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{response.text}: </span>
                  <span className={response.status === 'conforme' ? 'text-green-600' : response.status === 'naoConforme' ? 'text-red-600' : 'text-yellow-600'}>
                    {response.status === 'conforme' ? 'Conforme' : response.status === 'naoConforme' ? 'Não Conforme' : 'Não Informado'}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreVistoriaPage;

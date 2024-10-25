import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const NovaVistoria = () => {
  const [formData, setFormData] = useState({
    tipoInspecao: '',
    veiculo: '',
    placa: '',
    data: '',
    hodometro: '',
    possuiAvarias: '',
    fotosAvarias: [],
    kit: {
      macaco: false,
      chaveRoda: false,
      triangulo: false,
      calcoRodas: false,
      colete: false,
      cone: false,
    },
    nivelTanque: null,
    observacoes: '',
    assinatura: null,
  });

  const signatureRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.kit) {
      setFormData({
        ...formData,
        kit: { ...formData.kit, [name]: checked },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'fotosAvarias') {
      setFormData({ ...formData, fotosAvarias: Array.from(files) });
    } else if (name === 'nivelTanque') {
      setFormData({ ...formData, nivelTanque: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signatureDataUrl = signatureRef.current?.toDataURL();
    const formDataToSubmit = new FormData();

    for (const key in formData) {
      if (key === 'fotosAvarias') {
        formData.fotosAvarias.forEach(file => formDataToSubmit.append('fotosAvarias', file));
      } else if (key === 'nivelTanque' && formData.nivelTanque) {
        formDataToSubmit.append('nivelTanque', formData.nivelTanque);
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    }
    formDataToSubmit.append('assinatura', signatureDataUrl);

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/vistorias', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/vistorias/realizadas'); // Redireciona para a página de vistorias realizadas
    } catch (error) {
      console.error('Erro ao enviar vistoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const saveSignature = () => {
    const signatureDataUrl = signatureRef.current?.toDataURL();
    setFormData({ ...formData, assinatura: signatureDataUrl });
    toggleFullScreen();
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
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <Link
          to="/vistorias/realizadas"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          Voltar
        </Link>
        <h1 className="text-3xl font-bold mb-8 text-center">Nova Vistoria</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos do formulário */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Inspeção</label>
            <select
              name="tipoInspecao"
              value={formData.tipoInspecao}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Escolha...</option>
              <option value="Retirada">Retirada</option>
              <option value="Devolução">Devolução</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Veículo</label>
            <input
              type="text"
              name="veiculo"
              value={formData.veiculo}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Placa</label>
            <input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hodômetro</label>
            <input
              type="number"
              name="hodometro"
              value={formData.hodometro}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Veículo Possui Avarias?</label>
            <select
              name="possuiAvarias"
              value={formData.possuiAvarias}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Escolha...</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fotos Avarias</label>
            <input
              type="file"
              name="fotosAvarias"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-700">Veículo possui Kit?</span>
            {Object.keys(formData.kit).map((item) => (
              <label key={item} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={item}
                  checked={formData.kit[item]}
                  onChange={handleChange}
                  className="mr-2"
                />
                {item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nível do Tanque (Foto)</label>
            <input
              type="file"
              name="nivelTanque"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleFullScreen}
              className="text-blue-600 hover:underline"
            >
              Assinatura (Tela Cheia)
            </button>
          </div>

          {formData.assinatura && (
            <div className="mt-6">
              <h2 className="text-xl mb-2">Assinatura:</h2>
              <img src={formData.assinatura} alt="Assinatura" className="border border-gray-300 rounded-md" />
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 mt-6"
          >
            Enviar Vistoria
          </button>
        </form>

        {isFullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative bg-white p-4 rounded-lg">
              <h2 className="text-xl mb-4">Assinatura</h2>
              <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                canvasProps={{
                  width: window.innerWidth - 40,
                  height: window.innerHeight - 100,
                  className: 'border border-gray-300',
                }}
              />
              <button
                type="button"
                onClick={saveSignature}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Salvar Assinatura
              </button>
              <button
                type="button"
                onClick={toggleFullScreen}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NovaVistoria;

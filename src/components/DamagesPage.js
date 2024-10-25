import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DamagesPage = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const canvasRef = useRef(null);

  const [numeroBoletim, setNumeroBoletim] = useState('');
  const [terceiroEnvolvido, setTerceiroEnvolvido] = useState(false);

  const [formData, setFormData] = useState({
    dataOcorrencia: '',
    localSinistro: '',
    motorista: '',
    numeroOrdem: '',
    placa: '',
    fotos: [],
    descricaoAvarias: '',
    nomeTerceiro: '',
    telefoneTerceiro: '',
    marcaModeloVeiculo: '',
    placaTerceiro: '',
    descricaoAvariasTerceiro: '',
    fotosTerceiro: [],
    termoResponsabilidade: null,
    boletimTransito: null,
    observacoes: '',
  });

  const [message, setMessage] = useState('');

  // Geração automática do número do boletim
  useEffect(() => {
    const fetchLastBoletim = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/boletins/ultimo');
        const ultimoBoletim = response.data.numeroBoletim;
        const [ultimoNumero] = ultimoBoletim.split('/');
        const novoNumero = parseInt(ultimoNumero) + 1;
        setNumeroBoletim(`${novoNumero.toString().padStart(2, '0')}/${currentYear}`);
      } catch {
        setNumeroBoletim(`01/${currentYear}`);
      }
    };
    fetchLastBoletim();
  }, [currentYear]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: Array.from(files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append('numeroBoletim', numeroBoletim);

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => dataToSend.append(key, file));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    if (canvasRef.current) {
      const signatureImage = canvasRef.current.toDataURL('image/png');
      dataToSend.append('assinaturaVistoriador', signatureImage);
    }

    try {
      await axios.post('http://localhost:5000/api/boletins', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Boletim cadastrado com sucesso!');
    } catch {
      setMessage('Erro ao cadastrar boletim.');
    }
  };

  const handleBack = () => navigate('/access/operational');

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.beginPath();
  };

  const draw = (e) => {
    if (e.buttons !== 1) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
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
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Cadastro de Boletim de Avarias</h1>
          <button
            onClick={handleBack}
            className="py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
          >
            Voltar
          </button>
        </div>

        {message && <div className="mb-4 text-center text-green-500">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Número do Boletim</label>
            <input
              type="text"
              value={numeroBoletim}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Data e Hora da Ocorrência</label>
            <input
              type="datetime-local"
              name="dataOcorrencia"
              value={formData.dataOcorrencia}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Local do Sinistro</label>
            <input
              type="text"
              name="localSinistro"
              value={formData.localSinistro}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Motorista</label>
            <input
              type="text"
              name="motorista"
              value={formData.motorista}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Número de Ordem</label>
            <input
              type="text"
              name="numeroOrdem"
              value={formData.numeroOrdem}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Placa</label>
            <input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Fotos</label>
            <input
              type="file"
              name="fotos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Descrição das Avarias</label>
            <textarea
              name="descricaoAvarias"
              value={formData.descricaoAvarias}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Há Terceiro Envolvido?</label>
            <input
              type="checkbox"
              checked={terceiroEnvolvido}
              onChange={() => setTerceiroEnvolvido(!terceiroEnvolvido)}
            />
          </div>

          {terceiroEnvolvido && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium">Nome do Terceiro</label>
                <input
                  type="text"
                  name="nomeTerceiro"
                  value={formData.nomeTerceiro}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Telefone do Terceiro</label>
                <input
                  type="text"
                  name="telefoneTerceiro"
                  value={formData.telefoneTerceiro}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Marca/Modelo do Veículo</label>
                <input
                  type="text"
                  name="marcaModeloVeiculo"
                  value={formData.marcaModeloVeiculo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Placa do Terceiro</label>
                <input
                  type="text"
                  name="placaTerceiro"
                  value={formData.placaTerceiro}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Descrição das Avarias do Terceiro</label>
                <textarea
                  name="descricaoAvariasTerceiro"
                  value={formData.descricaoAvariasTerceiro}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Fotos do Veículo do Terceiro</label>
                <input
                  type="file"
                  name="fotosTerceiro"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium">Termo de Responsabilidade (PDF)</label>
            <input
              type="file"
              name="termoResponsabilidade"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Boletim de Ocorrência de Trânsito (PDF)</label>
            <input
              type="file"
              name="boletimTransito"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Assinatura do Vistoriador</label>
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="border border-gray-300 rounded"
              onMouseDown={startDrawing}
              onMouseMove={draw}
            />
            <button
              type="button"
              onClick={clearSignature}
              className="mt-2 py-1 px-4 bg-red-500 text-white rounded"
            >
              Limpar Assinatura
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Cadastrar Boletim
          </button>
        </form>
      </div>
    </div>
  );
};

export default DamagesPage;

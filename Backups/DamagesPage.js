import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Ícone personalizado para o marcador
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Função para desenhar sobre a imagem usando canvas nativo
const ImageAnnotator = ({ canvasRef }) => {
  const [savedImage, setSavedImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/images/2162.jpg';

    let drawing = false;

    const getMousePos = (canvas, event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const startDrawing = (e) => {
      drawing = true;
      const { x, y } = getMousePos(canvas, e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;

      const { x, y } = getMousePos(canvas, e);
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'red';
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mousemove', draw);
    };

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mousemove', draw);
    };
  }, [canvasRef]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    setSavedImage(dataURL);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={400}></canvas>
      <div>
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Salvar e Exibir Imagem
        </button>
      </div>
      {savedImage && (
        <div className="mt-4">
          <h3>Imagem Salva:</h3>
          <img src={savedImage} alt="Imagem Desenhada" style={{ border: '1px solid black', width: '600px', height: '400px' }} />
        </div>
      )}
    </div>
  );
};

// Função para assinatura do Vistoriador
const SignatureCanvas = ({ signatureRef, onSave }) => {
  useEffect(() => {
    const canvas = signatureRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let signing = false;

    const getMousePos = (canvas, event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const startSigning = (e) => {
      signing = true;
      const { x, y } = getMousePos(canvas, e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const stopSigning = () => {
      signing = false;
      ctx.beginPath();
    };

    const sign = (e) => {
      if (!signing) return;

      const { x, y } = getMousePos(canvas, e);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'black';
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    canvas.addEventListener('mousedown', startSigning);
    canvas.addEventListener('mouseup', stopSigning);
    canvas.addEventListener('mousemove', sign);

    return () => {
      canvas.removeEventListener('mousedown', startSigning);
      canvas.removeEventListener('mouseup', stopSigning);
      canvas.removeEventListener('mousemove', sign);
    };
  }, [signatureRef]);

  return (
    <div>
      <canvas ref={signatureRef} width={400} height={200} style={{ border: '1px solid black' }}></canvas>
      <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Salvar Assinatura
      </button>
    </div>
  );
};

const DamagesPage = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    numeroBoletim: `01/${currentYear}`,
    dataOcorrencia: '',
    localSinistro: '',
    numeroOrdem: '',
    placa: '',
    motorista: '',
    descricaoAvarias: '',
    terceiroEnvolvido: false,
    nomeTerceiro: '',
    telefoneTerceiro: '',
    marcaModeloTerceiro: '',
    placaTerceiro: '',
    descricaoAvariasTerceiro: '',
    fotosVeiculoTerceiro: [],
    boletimTransito: null,
    termoMotorista: null,
    observacoes: '',
    assinaturaVistoriador: '',
    location: { lat: -20.1287, lng: -40.3074 },
    address: '',
  });

  const [savedSignature, setSavedSignature] = useState(null); 
  const signatureRef = useRef(null); 
  const canvasRef = useRef(null);

  const saveSignature = () => {
    const canvas = signatureRef.current;
    const dataURL = canvas.toDataURL('image/png');
    setSavedSignature(dataURL); 
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;

    if (name === "fotosVeiculoTerceiro") {
      setFormData({
        ...formData,
        [name]: Array.from(e.target.files),
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();

    // Append all form data fields
    for (const key in formData) {
      if (key === "fotosVeiculoTerceiro") {
        formData.fotosVeiculoTerceiro.forEach((file, index) => {
          dataToSend.append(`fotosVeiculoTerceiro_${index}`, file);
        });
      } else {
        dataToSend.append(key, formData[key]);
      }
    }

    // Append the signature and drawing from the canvases
    if (signatureRef.current) {
      const signatureImage = signatureRef.current.toDataURL('image/png');
      dataToSend.append('signatureImage', signatureImage);
    }

    if (canvasRef.current) {
      const drawnImage = canvasRef.current.toDataURL('image/png');
      dataToSend.append('drawnImage', drawnImage);
    }

    // Log the dataToSend to debug the content before sending
    for (let pair of dataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/boletins', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Dados enviados com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const { road, city, postcode, country } = response.data.address;
      setFormData({
        ...formData,
        address: `${road || ''}, ${city || ''}, ${postcode || ''}, ${country || ''}`,
        localSinistro: `${road || ''}, ${city || ''}, ${postcode || ''}, ${country || ''}`,
      });
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      setFormData({
        ...formData,
        address: 'Endereço não encontrado',
      });
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          location: { lat: e.latlng.lat, lng: e.latlng.lng },
        });
        getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
      },
    });

    return formData.location ? <Marker position={formData.location} icon={icon} /> : null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg border border-gray-300 relative">
        <nav className="flex justify-around mb-6 border-b-2 border-gray-300">
          <button onClick={() => setFormData({...formData, activeTab: 'concluidos'})} className="flex-1 py-1 text-center font-semibold transition duration-300 text-sm">
            Boletins Concluídos
          </button>
          <button onClick={() => setFormData({...formData, activeTab: 'pendencia'})} className="flex-1 py-1 text-center font-semibold transition duration-300 text-sm">
            Boletins com Pendência
          </button>
          <button onClick={() => setFormData({...formData, activeTab: 'encaminhados'})} className="flex-1 py-1 text-center font-semibold transition duration-300 text-sm">
            Boletins Encaminhados
          </button>
          <button onClick={() => setFormData({...formData, activeTab: 'novo'})} className="flex-1 py-1 text-center font-semibold transition duration-300 text-sm">
            Novo Boletim
          </button>
        </nav>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nº do Boletim Interno</label>
            <input
              disabled
              value={formData.numeroBoletim}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Data e Hora da Ocorrência</label>
            <input
              type="datetime-local"
              name="dataOcorrencia"
              value={formData.dataOcorrencia}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Local do Sinistro</label>
            <input
              type="text"
              name="localSinistro"
              value={formData.localSinistro}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <MapContainer center={formData.location} zoom={13} style={{ height: '300px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
            <p className="text-sm mt-2">Clique no mapa para selecionar o local do sinistro</p>
            {formData.address && (
              <div className="mt-2 p-2 border rounded bg-gray-100">
                <strong>Endereço selecionado:</strong> {formData.address}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nº de Ordem</label>
            <input
              type="number"
              name="numeroOrdem"
              value={formData.numeroOrdem}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Placa</label>
            <input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Motorista</label>
            <input
              type="text"
              name="motorista"
              value={formData.motorista}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Descrição das Avarias do Veículo</label>
            <textarea
              name="descricaoAvarias"
              value={formData.descricaoAvarias}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Desenhe sobre a imagem do veículo</label>
            <ImageAnnotator canvasRef={canvasRef} />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Terceiro Envolvido?</label>
            <input
              type="checkbox"
              name="terceiroEnvolvido"
              checked={formData.terceiroEnvolvido}
              onChange={handleInputChange}
            />
          </div>

          {formData.terceiroEnvolvido && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Terceiro Envolvido</label>
                <input
                  type="text"
                  name="nomeTerceiro"
                  value={formData.nomeTerceiro}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Telefone do Terceiro</label>
                <input
                  type="text"
                  name="telefoneTerceiro"
                  value={formData.telefoneTerceiro}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Marca/Modelo do Veículo Envolvido</label>
                <input
                  type="text"
                  name="marcaModeloTerceiro"
                  value={formData.marcaModeloTerceiro}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Placa do Veículo Envolvido</label>
                <input
                  type="text"
                  name="placaTerceiro"
                  value={formData.placaTerceiro}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Descrição das Avarias do Veículo</label>
                <textarea
                  name="descricaoAvariasTerceiro"
                  value={formData.descricaoAvariasTerceiro}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Fotos do Veículo do Terceiro</label>
                <input
                  type="file"
                  name="fotosVeiculoTerceiro"
                  multiple
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Boletim de Trânsito/Unificado (PDF)</label>
            <input type="file" name="boletimTransito" onChange={handleFileChange} />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Termo Motorista (PDF)</label>
            <input type="file" name="termoMotorista" onChange={handleFileChange} />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Assinatura do Vistoriador</label>
            <SignatureCanvas signatureRef={signatureRef} onSave={saveSignature} />
            {savedSignature && (
              <div className="mt-4">
                <h3>Assinatura Salva:</h3>
                <img src={savedSignature} alt="Assinatura do Vistoriador" style={{ border: '1px solid black', width: '400px', height: '200px' }} />
              </div>
            )}
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Salvar Boletim
          </button>
        </form>
      </div>
    </div>
  );
};

export default DamagesPage;

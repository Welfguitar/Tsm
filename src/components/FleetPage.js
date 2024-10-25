import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ImageViewer = ({ src, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <img
        src={src}
        alt="Full Screen"
        className="max-h-full max-w-full cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
};

const Modal = ({ vehicle, onClose, onDelete }) => {
  const [fullScreenImage, setFullScreenImage] = useState(null);

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Detalhes do Veículo</h2>
        <div className="mb-4">
          <strong>Nº de Ordem:</strong> {vehicle.ordem}
        </div>
        <div className="mb-4">
          <strong>Placa:</strong> {vehicle.placa}
        </div>
        <div className="mb-4">
          <strong>Carroceria/Chassi:</strong> {vehicle.carroceria}
        </div>
        <div className="mb-4">
          <strong>Ano:</strong> {vehicle.ano}
        </div>
        <div className="mb-4">
          <strong>Observações:</strong> {vehicle.observacoes}
        </div>
        <div className="mb-4">
          <strong>Fotos:</strong>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {vehicle.fotos.map((foto, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${foto}`}
                alt={`Foto ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg cursor-pointer"
                onClick={() => setFullScreenImage(`http://localhost:5000/${foto}`)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Fechar
          </button>
          <button onClick={() => onDelete(vehicle._id)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Excluir
          </button>
        </div>
      </div>

      {fullScreenImage && (
        <ImageViewer src={fullScreenImage} onClose={() => setFullScreenImage(null)} />
      )}
    </div>
  );
};

const Fleet = () => {
  const [activeTab, setActiveTab] = useState('frota');
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    ordem: '',
    placa: '',
    carroceria: '',
    ano: '',
    fotos: Array(9).fill(null),
    observacoes: '',
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Buscar veículos do backend ao carregar a página
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(response.data);
      } catch (err) {
        console.error('Erro ao buscar veículos:', err);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
      setSelectedVehicle(null); // Fecha o modal após a exclusão
    } catch (err) {
      console.error('Erro ao excluir veículo:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('foto')) {
      const index = parseInt(name.replace('foto', ''));
      const files = [...formData.fotos];
      files[index] = e.target.files[0];
      setFormData({ ...formData, fotos: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('ordem', formData.ordem);
    data.append('placa', formData.placa);
    data.append('carroceria', formData.carroceria);
    data.append('ano', formData.ano);
    data.append('observacoes', formData.observacoes);
    formData.fotos.forEach(foto => {
      if (foto) data.append('fotos', foto);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/vehicles/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setVehicles([...vehicles, response.data]);
      setFormData({
        ordem: '',
        placa: '',
        carroceria: '',
        ano: '',
        fotos: Array(9).fill(null),
        observacoes: '',
      });
      setActiveTab('frota');
    } catch (err) {
      console.error('Erro ao adicionar veículo:', err);
    }
  };

  const sortedVehicles = vehicles.sort((a, b) => a.ordem - b.ordem);

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
        <h1 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Transmarle Transportes
        </h1>
  {/* Botões alinhados */}
    <nav className="flex justify-around mb-6">
    {/* Botão Voltar */}
    <Link
      to="/access/operational"
      className="flex-1 mx-2 px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-300"
    >
      Voltar
    </Link>
    </nav>
        <nav className="flex justify-around mb-6">
          <button
            onClick={() => setActiveTab('frota')}
            className={`flex-1 mx-2 px-6 py-2 rounded-lg ${activeTab === 'frota' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
          >
            Frota
          </button>
          <button
            onClick={() => setActiveTab('adicionar')}
            className={`flex-1 mx-2 px-6 py-2 rounded-lg ${activeTab === 'adicionar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
          >
            Adicionar Novo Veículo
          </button>
        </nav>

        {activeTab === 'frota' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4"></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedVehicles.map((vehicle, index) => (
                <div key={index} className="relative flex flex-col items-center w-full p-2 bg-gray-100 rounded-lg cursor-pointer" onClick={() => setSelectedVehicle(vehicle)}>
                  {vehicle.fotos[0] && (
                    <img
                      src={`http://localhost:5000/${vehicle.fotos[0]}`}
                      alt="Veículo"
                      className="mb-2 w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded">{vehicle.ordem}</span>
                </div>
              ))}
            </div>

            {selectedVehicle && (
              <Modal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} onDelete={handleDelete} />
            )}
          </div>
        ) : (
          <div className="h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Adicionar Novo Veículo</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Nº de Ordem</label>
                <input type="text" name="ordem" value={formData.ordem} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Digite o Nº de Ordem" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Placa</label>
                <input type="text" name="placa" value={formData.placa} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Digite a placa do veículo" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Carroceria/Chassi</label>
                <input type="text" name="carroceria" value={formData.carroceria} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Digite a carroceria/chassi" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Ano</label>
                <input type="number" name="ano" value={formData.ano} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Digite o ano do veículo" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Observações</label>
                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Digite observações sobre o veículo"></textarea>
              </div>
              {['Foto Principal', 'Foto Frontal', 'Foto Lado Direito', 'Foto Traseira', 'Foto Lado Esquerdo', 'Foto Interna', 'Foto do Cockpit'].map((label, index) => (
                <div className="mb-4" key={index}>
                  <label className="block mb-2 text-gray-700">{label}</label>
                  <input type="file" name={`foto${index}`} onChange={handleChange} className="w-full" />
                </div>
              ))}
              <button type="submit" className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Adicionar Veículo
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fleet;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VistoriasRealizadas = () => {
  const [vistorias, setVistorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVistorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vistorias');
      setVistorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar vistorias:', error);
      setError('Erro ao carregar vistorias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVistorias();
  }, []);

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
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Vistorias Realizadas</h1>
        
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-2">
            {vistorias.length > 0 ? (
              vistorias.map(vistoria => (
                <li key={vistoria.id} className="p-4 bg-gray-200 rounded-lg">
                  {vistoria.descricao} - {new Date(vistoria.data).toLocaleDateString()}
                </li>
              ))
            ) : (
              <li className="p-4 bg-gray-200 rounded-lg">Nenhuma vistoria foi realizada.</li>
            )}
          </ul>
        )}

        <Link
          to="/nova-vistoria"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
        >
          Nova Vistoria
        </Link>

        <Link
          to="/access/operational"
          className="mt-4 inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-300"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default VistoriasRealizadas;

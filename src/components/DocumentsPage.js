import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const vehicles = [
  100, 101, 104, 105, 106, 107, 2035, 2036, 2046, 2047,
  2054, 2055, 2056, 2057, 2058, 2059, 2060, 2061, 2062, 2063,
  // ... (restante da lista de veículos)
  2186, 2187
];

const DocumentsPage = () => {
  const [showVehicles, setShowVehicles] = useState(false);

  const toggleVehicles = () => {
    setShowVehicles((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Lista da Frota</h1>
      <button
        onClick={toggleVehicles}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-300"
      >
        {showVehicles ? 'Ocultar Documentos' : 'Mostrar Documentos'}
      </button>
      {showVehicles && (
        <ul className="w-full max-w-md bg-white rounded-lg shadow-lg">
          {vehicles.map(vehicle => (
            <li
              key={vehicle}
              className="flex justify-between items-center px-6 py-4 border-b border-gray-200 hover:bg-gray-100 transition duration-200"
            >
              <span className="text-lg">Veículo Nº {vehicle}</span>
              <Link 
                to={`/vehicle/${vehicle}`} 
                className="text-blue-600 hover:underline" 
                aria-label={`Ver detalhes do veículo número ${vehicle}`}
              >
                Ver Detalhes
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentsPage;

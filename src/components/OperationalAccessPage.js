// OperationalAccessPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdDirectionsBus, 
  MdContentPasteSearch, 
  MdDescription, 
  MdReport 
} from 'react-icons/md';
import { IoDocumentsOutline } from 'react-icons/io5';
import { FaCarCrash, FaFileInvoiceDollar } from 'react-icons/fa';

const SubLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="w-full flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-950 to-blue-800 
      text-white rounded-lg shadow-md hover:shadow-xl hover:from-pink-600 hover:to-pink-400
      transition duration-300 ease-in-out"
    style={{ fontFamily: 'Poppins, sans-serif' }}
  >
    {icon} <span className="text-lg font-semibold tracking-wide">{label}</span>
  </Link>
);

const OperationalAccessPage = () => {
  const [showInspectionsSubmenu, setShowInspectionsSubmenu] = useState(false);
  const [showDocumentsSubmenu, setShowDocumentsSubmenu] = useState(false);

  const toggleInspectionsSubmenu = () => setShowInspectionsSubmenu(prev => !prev);
  const toggleDocumentsSubmenu = () => setShowDocumentsSubmenu(prev => !prev);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <div className="w-full max-w-6xl p-10 bg-white/10 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md">
        <h1 className="text-4xl font-extrabold text-center text-white tracking-wide mb-10">
          Transmarle Operacional
        </h1>

        {/* Primeira linha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SubLink to="/fleet" icon={<MdDirectionsBus className="text-3xl" />} label="Frota" />
          <SubLink to="/boletim-interno" icon={<FaFileInvoiceDollar className="text-3xl" />} label="Boletins Internos" />
          <SubLink to="/damages" icon={<FaCarCrash className="text-3xl" />} label="Iniciar Novo Boletim" />
        </div>

        {/* Segunda linha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <SubLink to="/budgets" icon={<FaFileInvoiceDollar className="text-3xl" />} label="Orçamentos" />
          <SubLink to="/inspection-report" icon={<MdReport className="text-3xl" />} label="Relato de Inspeção" />
          <SubLink to="/boletim-interno" icon={<MdReport className="text-3xl" />} label="Segurança - Boletins" />
        </div>

        {/* Documentos e Vistorias */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="relative">
            <button
              onClick={toggleDocumentsSubmenu}
              className="w-full flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-950 to-blue-800 
              text-white rounded-lg shadow-md hover:shadow-xl hover:from-pink-600 hover:to-pink-400 
              transition duration-300 ease-in-out font-semibold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <IoDocumentsOutline className="text-4xl" /> Documentos
            </button>
            {showDocumentsSubmenu && (
              <div className="absolute left-0 mt-2 w-full bg-white/90 rounded-lg shadow-lg">
                <SubLink to="/documentos/crlv-e" icon={<MdDescription />} label="CRLV-e" />
                <SubLink to="/documentos/ceturb" icon={<MdDescription />} label="Ceturb" />
                <SubLink to="/documentos/cronotacografo" icon={<MdDescription />} label="Cronotacógrafo" />
                <SubLink to="/documentos/laudos" icon={<MdDescription />} label="Laudo de Fumaça" />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={toggleInspectionsSubmenu}
              className="w-full flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-950 to-blue-800 
              text-white rounded-lg shadow-md hover:shadow-xl hover:from-pink-600 hover:to-pink-400 
              transition duration-300 ease-in-out font-semibold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <MdContentPasteSearch className="text-4xl" /> Vistorias
            </button>
            {showInspectionsSubmenu && (
              <div className="absolute left-0 mt-2 w-full bg-white/90 rounded-lg shadow-lg">
                <SubLink to="/vistorias/vale" icon={<MdContentPasteSearch />} label="Vistorias Vale" />
                <SubLink to="/vistorias/pre-vistoria" icon={<MdContentPasteSearch />} label="Pré-Vistoria" />
                <SubLink to="/vistorias/realizadas" icon={<MdContentPasteSearch />} label="Vistoria Retirada/Devolução" />
              </div>
            )}
          </div>
        </div>

        <Link
          to="/dashboard"
          className="mt-10 w-full flex items-center justify-center px-6 py-3 bg-gray-700 
          text-white rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg 
          transition duration-300 ease-in-out"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default OperationalAccessPage;

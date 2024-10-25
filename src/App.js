import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ListUsersPage from './components/ListUsersPage';
import OperationalAccessPage from './components/OperationalAccessPage';
import FleetPage from './components/FleetPage';
import DocumentsPage from './components/DocumentsPage';
import InspectionsPage from './components/InspectionsPage';
import DamagesPage from './components/DamagesPage';
import VistoriasVale from './components/VistoriasVale';
import InspectionRetiradaDevolucaoPage from './components/InspectionRetiradaDevolucaoPage';
import VistoriasRealizadas from './components/VistoriasRealizadas';
import NovaVistoria from './components/NovaVistoria';
import AddUserPage from './components/AddUserPage';
import PreVistoriaPage from './components/PreVistoriaPage';
import CrlvePage from './components/CrlvePage';
import LaudoFumacaPage from './components/LaudoFumacaPage';
import InspectionReportPage from './components/InspectionReportPage';
import CeturbPage from './components/CeturbPage'; // Import the CRLV-e page
import BudgetsPage from './components/BudgetsPage'; // Importar a nova pág
import BoletinInternoPage from './components/BoletinInternoPage'; // Importando a nova página

function App() {
  const [user, setUser] = useState(null);

  // Component for protected routes
  const ProtectedRoute = ({ element, requiredPrivilege }) => {
    return user && user.privileges.includes(requiredPrivilege) ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/" />} />
        <Route
          path="/access/driver"
          element={<ProtectedRoute element={<div>Driver Access Page</div>} requiredPrivilege="driver" />}
        />
        <Route
          path="/access/operational"
          element={<ProtectedRoute element={<OperationalAccessPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/list-users"
          element={<ProtectedRoute element={<ListUsersPage />} requiredPrivilege="admin" />}
        />
        <Route
          path="/fleet"
          element={<ProtectedRoute element={<FleetPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/documents"
          element={<ProtectedRoute element={<DocumentsPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/inspections"
          element={<ProtectedRoute element={<InspectionsPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/damages"
          element={<ProtectedRoute element={<DamagesPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/vistorias/vale"
          element={<ProtectedRoute element={<VistoriasVale />} requiredPrivilege="operational" />}
        />
        <Route
          path="/inspections/retirada-devolucao"
          element={<ProtectedRoute element={<InspectionRetiradaDevolucaoPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/vistorias/realizadas"
          element={<ProtectedRoute element={<VistoriasRealizadas />} requiredPrivilege="operational" />}
        />
        <Route
          path="/nova-vistoria"
          element={<ProtectedRoute element={<NovaVistoria />} requiredPrivilege="operational" />}
        />
        <Route
          path="/add-user"
          element={<ProtectedRoute element={<AddUserPage />} requiredPrivilege="admin" />}
        />
        <Route
          path="/vistorias/pre-vistoria"
          element={<ProtectedRoute element={<PreVistoriaPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/documentos/crlv-e"
          element={<ProtectedRoute element={<CrlvePage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/documentos/laudos"
          element={<ProtectedRoute element={<LaudoFumacaPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/documentos/ceturb"
          element={<ProtectedRoute element={<CeturbPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/inspection-report"
          element={<ProtectedRoute element={<InspectionReportPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="/budgets"
          element={<ProtectedRoute element={<BudgetsPage />} requiredPrivilege="operational" />}
        />
        <Route
          path="//boletim-interno"
          element={<ProtectedRoute element={<BoletinInternoPage />} requiredPrivilege="operational" />}
        />
      </Routes>
      
    </Router>
  );
}

export default App;

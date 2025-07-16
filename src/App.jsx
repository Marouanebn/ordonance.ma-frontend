import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import SelectRolePage from './components/SelectRolePage.jsx';
import Dashboard from './components/Dashboard.jsx'; // Add this import
import Dashboard1 from './components/Dashboard1.jsx'; // Add this import
import DashboardMedecin from './components/DashboardMedecin.jsx';
import DashboardPharmacien from './components/DashboardPharmacien.jsx';
import DashboardLaboratoire from './components/DashboardLaboratoire.jsx';
import DashboardPatient from './components/DashboardPatient.jsx';
import OrdonanceMedecinPage from './components/medecin/OrdonanceMedecinPage';
import CreateOrdonancePage from './components/medecin/CreateOrdonancePage';
import MedicamentsMedecinPage from './components/medecin/MedicamentsMedecinPage';
import CreateMedicamentPage from './components/medecin/CreateMedicamentPage';
import SettingsPage from './components/common/SettingsPage.jsx';
import MesOrdonnancesPatientPage from './components/patient/MesOrdonnancesPatientPage.jsx';
import OrdonnanceValidationPharmacienPage from './components/pharmacien/OrdonnanceValidationPharmacienPage.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function getDashboardRouteForRole(role) {
  if (role === 'medecin') return '/dashboard-medecin';
  if (role === 'patient') return '/dashboard-patient';
  if (role === 'pharmacien') return '/dashboard-pharmacien';
  if (role === 'laboratoire') return '/dashboard-laboratoire';
  if (role === 'admin') return '/dashboard';
  return '/';
}

function getUserRole() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    // Try to get role from localStorage (set on login)
    const roleMsg = localStorage.getItem('roleMessage');
    if (roleMsg) {
      if (roleMsg.includes('médecin')) return 'medecin';
      if (roleMsg.includes('patient')) return 'patient';
      if (roleMsg.includes('pharmacien')) return 'pharmacien';
      if (roleMsg.includes('laboratoire')) return 'laboratoire';
      if (roleMsg.includes('admin')) return 'admin';
    }
    // fallback: just check token
    return 'unknown';
  } catch {
    return null;
  }
}

function PrivateRoute() {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/" replace />;
}

function PublicRoute() {
  const token = localStorage.getItem('token');
  if (!token) return <Outlet />;
  // If already logged in, redirect to dashboard
  const role = getUserRole();
  return <Navigate to={getDashboardRouteForRole(role)} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (login, register) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/select-role" element={<SelectRolePage />} />
        </Route>
        {/* Private routes (all dashboards, protected pages) */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard-medecin" element={<DashboardMedecin />} />
          <Route path="/dashboard-pharmacien" element={<DashboardPharmacien />} />
          <Route path="/dashboard-laboratoire" element={<DashboardLaboratoire />} />
          <Route path="/dashboard-patient" element={<DashboardPatient />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard1" element={<Dashboard1 />} />
          <Route path="/medecin/ordonance" element={<OrdonanceMedecinPage />} />
          <Route path="/medecin/ordonance/creer" element={<CreateOrdonancePage />} />
          <Route path="/medecin/medicaments" element={<MedicamentsMedecinPage />} />
          <Route path="/medecin/medicaments/creer" element={<CreateMedicamentPage />} />
          <Route path="/parametres" element={<SettingsPage />} />
          <Route path="/patient/ordonnances" element={<MesOrdonnancesPatientPage />} />
          <Route path="/pharma/ordonance-validation" element={<OrdonnanceValidationPharmacienPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
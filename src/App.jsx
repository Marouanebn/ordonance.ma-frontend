import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import SelectRolePage from './components/SelectRolePage.jsx';
import Dashboard from './components/Dashboard.jsx'; // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/select-role" element={<SelectRolePage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Uncomment and add */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
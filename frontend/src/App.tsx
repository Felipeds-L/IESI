import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/login/loginPage';
import DashboardPage from './pages/dashboard/dashboardPage';
import AdminPage from './pages/admin/adminPage';
import PacientesPage from './pages/pacientes/pacientesPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          className: 'toast-custom',
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pacientes" element={<PacientesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />{/*Se o usuário digitar qualquer coisa errada, volta pro Login*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
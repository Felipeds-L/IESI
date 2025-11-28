import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/loginPage';
import DashboardPage from './pages/dashboard/dashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />{/*Se o usuário digitar qualquer coisa errada, volta pro Login*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SellerDashboard from './pages/SellerDashboard'; // Crie esse arquivo conforme a prototipação

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota inicial: Login */}
                <Route path="/" element={<LoginPage />} />

                {/* Rotas de Vendedor */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />

                {/* Rota de Admin (vazia por enquanto) */}
                <Route path="/admin/dashboard" element={<div>Painel Admin em construção</div>} />
            </Routes>
        </BrowserRouter>
    );
}
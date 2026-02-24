import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import SellerDashboard from './pages/SellerDashboard';
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota inicial: Login */}
                <Route path="/" element={<LoginPage />} />

                {/* Rota para o perfil SELLER */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />

                {/* Rota para o perfil ADMIN */}
                <Route path="/admin/dashboard" element={
                    <div className="min-h-screen bg-check-blue flex items-center justify-center text-white font-black uppercase tracking-tighter">
                        Painel Admin em Construção
                    </div>
                } />

                {/* Fallback: Se a rota não existir, volta para o login */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
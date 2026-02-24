import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage'; // Caminho para o Login
import SellerDashboard from './pages/Dashboard/SellerDashboard'; // Caminho para o Dashboard

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* O path="/" define que esta é a página de início. 
                  Ao abrir http://localhost:5173, o LoginPage será carregado.
                */}
                <Route path="/" element={<LoginPage />} />

                {/* Rota para o Dashboard do Vendedor */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />

                {/* Rota de Admin */}
                <Route path="/admin/dashboard" element={
                    <div className="min-h-screen bg-check-blue flex items-center justify-center text-white">
                        Painel Admin em Construção
                    </div>
                } />

                {/* Se o usuário digitar qualquer outra coisa, volta para o Login */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
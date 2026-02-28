import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminSellerList from './pages/Admin/Seller/AdminSellerList';
import AdminSellerCreate from './pages/Admin/Seller/AdminSellerCreate';
import AdminSellerEdit from './pages/Admin/Seller/AdminSellerEdit';
import AdminCustomerList from './pages/Admin/Customer/AdminCustomerList';
import AdminCustomerCreate from './pages/Admin/Customer/AdminCustomerCreate'; 
import AdminCustomerEdit from './pages/Admin/Customer/AdminCustomerEdit';
export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Rota inicial: Login */}
                <Route path="/" element={<LoginPage />} />

                {/* Rotas de Vendedor */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />

                {/* Painel Administrativo Principal */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* CRUD de Vendedores */}
                <Route path="/admin/sellers/list" element={<AdminSellerList />} />
                <Route path="/admin/sellers/new" element={<AdminSellerCreate />} />
                <Route path="/admin/sellers/edit/:id" element={<AdminSellerEdit />} />

                {/* CRUD de Clientes */}
                <Route path="/admin/customers/list" element={<AdminCustomerList />} />
                <Route path="/admin/customers/new" element={<AdminCustomerCreate />} />
                <Route path="/admin/customers/edit/:id" element={<AdminCustomerEdit />} />

                {/* Histórico de Visitas */}
                <Route path="/admin/visits/history" element={<div className="p-10 text-white">Histórico em construção</div>} />

                {/* Fallback de Segurança: Redireciona rotas inexistentes para o login */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
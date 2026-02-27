import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminSellerForm from './pages/Admin/Seller/AdminSellerForm';
import AdminSellerList from './pages/Admin/Seller/AdminSellerList';
import AdminCustomerForm from './pages/Admin/Customer/AdminCustomerForm';
import AdminCustomerList from './pages/Admin/Customer/AdminCustomerList';

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
                <Route path="/admin/sellers/new" element={<AdminSellerForm />} />
                <Route path="/admin/sellers/list" element={<AdminSellerList />} />
                {/* Rota para edição reaproveitando o formulário */}
                <Route path="/admin/sellers/edit/:id" element={<AdminSellerForm />} />

                {/* CRUD de Clientes */}
                <Route path="/admin/customers/new" element={<AdminCustomerForm />} />
                <Route path="/admin/customers/list" element={<AdminCustomerList />} />

                {/* Fallback: Redireciona para o login se a rota não existir */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
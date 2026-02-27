import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminSellerForm from './pages/Admin/Seller/AdminSellerForm';
import AdminSellerList from './pages/Admin/Seller/AdminSellerList';
import AdminCustomerForm from './pages/Admin/Customer/AdminCustomerForm';
import AdminCustomerList from './pages/Admin/Customer/AdminCustomerList';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Página de Início */}
                <Route path="/" element={<LoginPage />} />

                {/* Fluxo do Vendedor */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />

                {/* Fluxo Principal do Admin */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Rotas de Gestão de Vendedores */}
                <Route path="/admin/sellers/new" element={<AdminSellerForm />} />
                <Route path="/admin/sellers/list" element={<AdminSellerList />} />
                <Route path="/admin/sellers/edit/:id" element={<AdminSellerForm />} />

                {/* Rotas de Gestão de Clientes */}
                <Route path="/admin/customers/new" element={<AdminCustomerForm />} />
                <Route path="/admin/customers/list" element={<AdminCustomerList />} />

                {/* Redirecionamento de segurança */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
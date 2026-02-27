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

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota inicial: Login */}
                <Route path="/" element={<LoginPage />} />

                {/* Fluxo do Vendedor */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />

                {/* Fluxo Principal do Admin */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* CRUD de Vendedores */}
                <Route path="/admin/sellers/list" element={<AdminSellerList />} />
                <Route path="/admin/sellers/new" element={<AdminSellerCreate />} />
                <Route path="/admin/sellers/edit/:id" element={<AdminSellerEdit />} />

                {/* CRUD de Clientes */}
                <Route path="/admin/customers/list" element={<AdminCustomerList />} />
                <Route path="/admin/customers/new" element={<AdminCustomerCreate />} />
                <Route path="/admin/customers/edit/:id" element={<AdminCustomerEdit />} />

                {/* Fallback de Segurança: Qualquer rota inválida volta para o Login */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
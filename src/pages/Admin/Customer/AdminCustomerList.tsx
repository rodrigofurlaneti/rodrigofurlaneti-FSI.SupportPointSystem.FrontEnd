import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Trash2, Landmark, Search, Loader2, MapPin, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { customerService } from '../../../services/customerService';

const MySwal = withReactContent(Swal);

export interface Address {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

export interface Customer {
    id: string;
    companyName: string;
    cnpj: string;
    address: Address;
    latitude: number;
    longitude: number;
    active: boolean;
}

export default function AdminCustomerList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.getAll();
            setCustomers(data);
        } catch (err) {
            console.error("Erro ao carregar clientes", err);
            MySwal.fire({
                title: t('error'),
                text: 'Não foi possível carregar a lista de clientes.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (customer: Customer) => {
        const result = await MySwal.fire({
            title: t('confirm_action_title') || 'Tem certeza?',
            text: `Deseja remover permanentemente a empresa: ${customer.companyName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334151',
            confirmButtonText: t('confirm_button_delete') || 'Sim, remover',
            cancelButtonText: t('cancel_button'),
            background: '#1e293b',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await customerService.delete(customer.id);
                setCustomers(prev => prev.filter(c => c.id !== customer.id));
                MySwal.fire({
                    title: 'Removido!',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (err) {
                MySwal.fire({
                    title: t('error'),
                    text: 'Falha ao deletar cliente no servidor.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        }
    };

    // Filtro inteligente por nome, CNPJ ou Cidade
    const filteredCustomers = customers.filter(c =>
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj.includes(searchTerm.replace(/\D/g, '')) ||
        c.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            <HeaderAdmin userName="RODRIGO FURLANETTI" onLogout={() => navigate('/')} />

            <main className="p-6 pt-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 text-slate-500 hover:text-check-green transition-colors uppercase text-[10px] font-bold tracking-widest"
                    >
                        <ArrowLeft size={16} /> {t('cancel_button')}
                    </button>

                    <div className="flex flex-1 max-w-md relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar empresa, CNPJ ou cidade..."
                            className="w-full bg-check-card border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-check-green/30 text-sm transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => navigate('/admin/customers/new')}
                        className="bg-check-green text-check-blue px-6 py-3 rounded-2xl font-black italic uppercase text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-check-green/20"
                    >
                        <Landmark size={18} /> {t('add_new')}
                    </button>
                </div>

                <div className="bg-check-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-check-green" size={42} />
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                {t('syncing_customers')}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                                        <th className="p-6 font-bold">Empresa / CNPJ</th>
                                        <th className="p-6 font-bold">Endereço</th>
                                        <th className="p-6 font-bold">Geolocalização</th>
                                        <th className="p-6 font-bold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold italic text-sm text-white">{customer.companyName}</span>
                                                        <span className="text-[11px] text-slate-500 font-mono">
                                                            {customer.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-slate-400 text-xs">
                                                    <div className="flex flex-col">
                                                        <span>{customer.address.street}, {customer.address.number}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                                                            {customer.address.neighborhood} - {customer.address.city}/{customer.address.state}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-slate-500 text-[10px] font-mono">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} className="text-check-green" />
                                                        {customer.latitude.toFixed(6)}, {customer.longitude.toFixed(6)}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}
                                                            className="p-2 hover:bg-check-green/20 text-check-green rounded-xl transition-all"
                                                            title="Editar Cliente"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(customer)}
                                                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                                                            title="Excluir Cliente"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-10 text-center text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                                Nenhum cliente encontrado com esse termo
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <p className="text-center mt-12 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                    FSI Point System • Management Suite 2026
                </p>
            </main>
        </div>
    );
}
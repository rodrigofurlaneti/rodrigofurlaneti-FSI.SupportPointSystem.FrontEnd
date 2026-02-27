import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Trash2, Landmark, Search, Loader2, Map } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import api from '../../../services/api';

const MySwal = withReactContent(Swal);

interface Customer {
    id: string;
    companyName: string;
    cnpj: string;
    latitudeTarget: number;
    longitudeTarget: number;
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
            const token = localStorage.getItem('@CheckVisit:token');
            const response = await api.get('/Admin/Customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(response.data);
        } catch (err) {
            console.error("Erro ao carregar clientes", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            <HeaderAdmin userName="RODRIGO FURLANETI" onLogout={() => navigate('/')} />

            <main className="p-6 pt-12 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 text-slate-500 hover:text-check-green transition-colors uppercase text-[10px] font-bold tracking-[0.2em]"
                    >
                        <ArrowLeft size={16} /> {t('cancel_button')}
                    </button>

                    <div className="flex flex-1 max-w-md relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder={t('summary_placeholder')}
                            className="w-full bg-check-card border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-check-green/30 transition-all text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => navigate('/admin/customers/new')}
                        className="bg-check-green text-check-blue px-6 py-3 rounded-2xl font-black italic uppercase text-xs flex items-center gap-2"
                    >
                        <Landmark size={18} /> {t('add_new')}
                    </button>
                </div>

                <div className="bg-check-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-check-green" size={42} />
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{t('syncing_customers')}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                                        <th className="p-6 font-bold">Empresa</th>
                                        <th className="p-6 font-bold">CNPJ</th>
                                        <th className="p-6 font-bold">Coordenadas</th>
                                        <th className="p-6 font-bold text-right">{t('available_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6 font-bold italic text-sm">{customer.companyName}</td>
                                            <td className="p-6 text-slate-400 text-sm">{customer.cnpj}</td>
                                            <td className="p-6 text-slate-400 text-[10px] font-mono">
                                                {customer.latitudeTarget.toFixed(6)}, {customer.longitudeTarget.toFixed(6)}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all">
                                                        <Map size={18} />
                                                    </button>
                                                    <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
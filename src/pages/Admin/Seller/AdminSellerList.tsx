import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Trash2, UserPlus, Search, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { sellerService } from '../../../services/sellerService';

const MySwal = withReactContent(Swal);

// Interface alinhada ao retorno da procedure SpGetAllSellers
interface Seller {
    id: string;
    name: string;
    phone: string;
    email: string;
    active: boolean;
    cpf: string; // CPF agora vem do JOIN com a tabela Users
}

export default function AdminSellerList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSellers();
    }, []);

    const loadSellers = async () => {
        try {
            setLoading(true);
            // Chama o service que executa a procedure SpGetAllSellers
            const data = await sellerService.getAll();
            setSellers(data as Seller[]);
        } catch (err: any) {
            console.error("Erro ao carregar vendedores", err);
            MySwal.fire({
                title: t('error'),
                text: t('load_error_msg') || 'Erro ao conectar com o banco de dados.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (seller: Seller) => {
        const result = await MySwal.fire({
            title: t('confirm_action_title') || 'Tem certeza?',
            text: `${t('delete_confirm_msg') || 'Deseja excluir o vendedor'}: ${seller.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334151',
            confirmButtonText: t('confirm_button_delete') || 'Sim, excluir!',
            cancelButtonText: t('cancel_button'),
            background: '#1e293b',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                // Chama a procedure SpDeleteSeller (que limpa Sellers e Users)
                await sellerService.delete(seller.id);

                setSellers(prev => prev.filter(s => s.id !== seller.id));

                MySwal.fire({
                    title: t('deleted_success') || 'Excluído!',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (err: any) {
                MySwal.fire({
                    title: t('error'),
                    text: err.response?.data?.message || 'Falha ao deletar o registro.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        }
    };

    // Busca por Nome, Email ou CPF (sem formatação)
    const filteredSellers = sellers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.cpf.includes(searchTerm.replace(/\D/g, ''))
    );

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            <HeaderAdmin userName="RODRIGO FURLANETTI" onLogout={() => navigate('/')} />

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
                            placeholder={t('summary_placeholder') || "Buscar por nome, email ou CPF..."}
                            className="w-full bg-check-card border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-check-green/30 transition-all text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => navigate('/admin/sellers/new')}
                        className="bg-check-green text-check-blue px-6 py-3 rounded-2xl font-black italic uppercase text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-check-green/20"
                    >
                        <UserPlus size={18} /> {t('add_new')}
                    </button>
                </div>

                <div className="bg-check-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-check-green" size={42} />
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                {t('syncing_customers') || "Sincronizando dados..."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                                        <th className="p-6 font-bold">{t('name')}</th>
                                        <th className="p-6 font-bold">CPF</th>
                                        <th className="p-6 font-bold">{t('email')}</th>
                                        <th className="p-6 font-bold">{t('phone')}</th>
                                        <th className="p-6 font-bold text-right">{t('available_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredSellers.length > 0 ? (
                                        filteredSellers.map((seller) => (
                                            <tr key={seller.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold italic text-sm">{seller.name}</span>
                                                        {!seller.active && (
                                                            <span className="text-[9px] text-red-500 font-bold uppercase">{t('user_inactive') || 'Inativo'}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-slate-400 text-sm">
                                                    {seller.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                                                </td>
                                                <td className="p-6 text-slate-400 text-sm">{seller.email}</td>
                                                <td className="p-6 text-slate-400 text-sm">{seller.phone || '-'}</td>
                                                <td className="p-6">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => navigate(`/admin/sellers/edit/${seller.id}`)}
                                                            title={t('edit')}
                                                            className="p-2 hover:bg-check-green/20 text-check-green rounded-xl transition-all"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(seller)}
                                                            title={t('delete')}
                                                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-10 text-center text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                                {t('no_results') || "Nenhum vendedor encontrado"}
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
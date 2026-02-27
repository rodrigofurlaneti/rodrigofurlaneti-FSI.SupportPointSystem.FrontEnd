import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { sellerService } from '../../../services/sellerService';

const MySwal = withReactContent(Swal);

export default function AdminSellerEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);

    // Carrega os dados do vendedor ao montar a página
    useEffect(() => {
        async function loadSellerData() {
            if (!id) return;
            try {
                const data = await sellerService.getById(id);
                setName(data.name);
                setCpf(data.cpf);
                setEmail(data.email);
                setPhone(data.phone || '');
                setActive(data.active);
            } catch (err: any) {
                MySwal.fire({
                    title: t('error'),
                    text: t('seller_not_found'),
                    icon: 'error'
                });
                navigate('/admin/dashboard');
            }
        }
        loadSellerData();
    }, [id, navigate, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);

        try {
            // Chama a procedure SpUpdateSeller através do service
            await sellerService.update(id, {
                name,
                email,
                phone,
                cpf: cpf.replace(/\D/g, ''),
                active
            });

            MySwal.fire({
                title: t('update_success'),
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff'
            });

            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data || t('login_error_msg');
            MySwal.fire({
                title: t('error'),
                text: errorMessage,
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            <HeaderAdmin userName="RODRIGO FURLANETTI" onLogout={() => navigate('/')} />

            <main className="p-6 pt-12 max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-check-green transition-colors mb-8 uppercase text-[10px] font-bold tracking-[0.2em]"
                >
                    <ArrowLeft size={16} /> {t('cancel_button')}
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
                        {t('edit_seller')}
                    </h2>
                    <div className="h-1 w-20 bg-check-green mx-auto rounded-full shadow-[0_0_10px_rgba(132,204,22,0.3)]"></div>
                </div>

                <div className="bg-check-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label={t('name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <Input
                            label={t('cpf')}
                            value={cpf}
                            disabled // CPF não deve ser alterado na edição
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label={t('email')}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label={t('phone')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                            <input
                                type="checkbox"
                                id="active"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                className="w-5 h-5 accent-check-green"
                            />
                            <label htmlFor="active" className="text-sm font-bold uppercase tracking-wider">
                                {t('user_active')}
                            </label>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" loading={loading} className="flex gap-3 justify-center">
                                <Save size={20} /> {t('save_changes')}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
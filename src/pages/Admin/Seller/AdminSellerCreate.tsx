import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { sellerService } from '../../../services/sellerService';

const MySwal = withReactContent(Swal);

export default function AdminSellerCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // States alinhados com a procedure SpCreateSeller
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Formatação de CPF homologada para exibição
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            setCpf(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Chamada ao service que dispara a procedure SpCreateSeller
            await sellerService.create({
                name,
                cpf: cpf.replace(/\D/g, ''), // Envia apenas números
                email,
                phone,
                password,
                role: 'SELLER'
            });

            MySwal.fire({
                title: t('login_success_title'),
                text: t('seller_created_success'),
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff'
            });

            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (err: any) {
            // Tratamento de erro robusto para evitar [object Object]
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
                        {t('add_new')} {t('manage_sellers')}
                    </h2>
                    <div className="h-1 w-20 bg-check-green mx-auto rounded-full shadow-[0_0_10px_rgba(132,204,22,0.3)]"></div>
                </div>

                <div className="bg-check-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label={t('name')}
                            placeholder="Ex: João da Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <Input
                            label={t('cpf')}
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={handleCpfChange}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label={t('email')}
                                type="email"
                                placeholder="vendedor@empresa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label={t('phone')}
                                placeholder="(19) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <Input
                            label={t('password')}
                            isPassword
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="pt-4">
                            <Button type="submit" loading={loading} className="flex gap-3 justify-center">
                                <Save size={20} /> {t('confirm_button_finish')}
                            </Button>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-12 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                    FSI Point System • Management Suite 2026
                </p>
            </main>
        </div>
    );
}
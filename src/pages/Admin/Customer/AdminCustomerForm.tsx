import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Landmark, MapPin, Hash } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import api from '../../../services/api';

const MySwal = withReactContent(Swal);

export default function AdminCustomerForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [latitudeTarget, setLatitudeTarget] = useState('');
    const [longitudeTarget, setLongitudeTarget] = useState('');
    const [loading, setLoading] = useState(false);

    // Formatação de CNPJ Básica
    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, "$1.$2")
                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1/$2")
                .replace(/(\d{4})(\d)/, "$1-$2");
            setCnpj(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('@CheckVisit:token');

            await api.post('/Admin/Customers', {
                companyName,
                cnpj: cnpj.replace(/\D/g, ''),
                latitudeTarget: parseFloat(latitudeTarget),
                longitudeTarget: parseFloat(longitudeTarget)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            MySwal.fire({
                title: t('login_success_title'),
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff'
            });

            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (err: any) {
            MySwal.fire({
                title: t('error'),
                text: err.response?.data?.message || t('login_error_msg'),
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
            <HeaderAdmin userName="RODRIGO FURLANETI" onLogout={() => navigate('/')} />

            <main className="p-6 pt-12 max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-check-green transition-colors mb-8 uppercase text-[10px] font-bold tracking-[0.2em]"
                >
                    <ArrowLeft size={16} /> {t('cancel_button')}
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
                        {t('add_new')} {t('manage_customers')}
                    </h2>
                    <div className="h-1 w-20 bg-check-green mx-auto rounded-full"></div>
                </div>

                <div className="bg-check-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label={t('name') || "Nome da Empresa"}
                            placeholder="Ex: Filial Campinas"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />

                        <Input
                            label="CNPJ"
                            placeholder="00.000.000/0000-00"
                            value={cnpj}
                            onChange={handleCnpjChange}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Latitude Target"
                                type="number"
                                step="any"
                                placeholder="-23.000000"
                                value={latitudeTarget}
                                onChange={(e) => setLatitudeTarget(e.target.value)}
                                required
                            />
                            <Input
                                label="Longitude Target"
                                type="number"
                                step="any"
                                placeholder="-47.000000"
                                value={longitudeTarget}
                                onChange={(e) => setLongitudeTarget(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" loading={loading} className="flex gap-3 justify-center">
                                <Save size={20} /> {t('confirm_button_finish')}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
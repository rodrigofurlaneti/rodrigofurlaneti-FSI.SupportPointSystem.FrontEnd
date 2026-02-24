import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import logoImg from '../../assets/logotipo.png';
import api from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const MySwal = withReactContent(Swal);

export default function LoginPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // States Homologados
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    // Efeito de GPS Homologado
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    console.log("Localização capturada com sucesso.");
                },
                (error) => {
                    console.warn("Erro ao obter localização:", error.message);
                }
            );
        }
    }, []);

    // Função de Troca de Idioma
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    // Formatação de CPF Homologada
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            setCpf(value);
        }
    };

    // Lógica de Submit Homologada
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/Auth/login', {
                cpf: cpf.replace(/\D/g, ''),
                password,
            });

            const { token, sellerId, name, role } = response.data;
            localStorage.setItem('@CheckVisit:token', token);
            localStorage.setItem('@CheckVisit:sellerId', sellerId);
            localStorage.setItem('@CheckVisit:sellerName', name);

            MySwal.fire({
                title: t('login_success_title'),
                text: `${t('welcome')}, ${name}!`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff'
            });

            setTimeout(() => {
                navigate(role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard');
            }, 1500);
        } catch (err: any) {
            MySwal.fire({
                title: t('error'),
                text: err.response?.data?.message || err.response?.data || t('login_error_msg'),
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-check-blue flex items-center justify-center p-4 text-white relative">

            {/* SELETOR DE IDIOMAS MULTI-LÍNGUA */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('language')}:</span>
                <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                    className="bg-check-card border border-white/10 text-[10px] font-bold rounded-lg p-2 outline-none focus:ring-1 focus:ring-white/20 transition-all cursor-pointer uppercase"
                >
                    <option value="pt">Português 🇧🇷</option>
                    <option value="en">English 🇺🇸</option>
                    <option value="es">Español 🇪🇸</option>
                    <option value="fr">Français 🇫🇷</option>
                    <option value="zh">中文 🇨🇳</option>
                </select>
            </div>

            <div className="w-full max-w-md bg-check-card p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center">
                <img src={logoImg} alt="Logo" className="w-44 mb-8" />

                <p className="text-slate-400 mb-8 text-sm">{t('login_subtitle')}</p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <Input
                        label={t('cpf')}
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCpfChange}
                        required
                    />

                    <Input
                        label={t('password')}
                        isPassword
                        placeholder="        "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" loading={loading}>
                        {t('enter_system')}
                    </Button>
                </form>

                <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    FSI Point System   2026
                </p>
            </div>
        </div>
    );
}
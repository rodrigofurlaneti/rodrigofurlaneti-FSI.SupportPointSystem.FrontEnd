import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Fingerprint, MessageCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logoImg from '../../assets/logotipo.png';
import api from '../../services/api';

const MySwal = withReactContent(Swal);

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Localização obtida:", position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    MySwal.fire({
                        title: 'GPS Necessário',
                        text: 'Habilite o GPS para validar as visitas.',
                        icon: 'warning',
                        confirmButtonColor: '#84cc16',
                        background: '#334151',
                        color: '#fff'
                    });
                }
            );
        }
    }, []);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            setCpf(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/Auth/login', {
                cpf: cpf.replace(/\D/g, ''),
                password: password
            });

            const { token } = response.data;
            localStorage.setItem('@CheckVisit:token', token);

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));

            const userRole = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            MySwal.fire({
                title: 'Sucesso!',
                text: 'Redirecionando...',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#334151',
                color: '#fff'
            });

            setTimeout(() => {
                if (userRole === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/seller/dashboard');
                }
            }, 1500);

        } catch (err: any) {
            MySwal.fire({
                title: 'Erro',
                text: 'CPF ou senha incorretos.',
                icon: 'error',
                confirmButtonColor: '#84cc16',
                background: '#334151',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-check-blue flex items-center justify-center p-4 font-sans text-white">
            <div className="w-full max-w-md bg-check-card p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center">
                <div className="mb-8">
                    <img src={logoImg} alt="CheckVisit Logo" className="w-44 h-auto object-contain" />
                </div>
                <p className="text-slate-300 mb-8 text-sm text-center">Bom dia! Pronto para hoje?</p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <input
                        type="text"
                        placeholder="CPF 000.000.000-00"
                        className="w-full bg-white text-slate-900 p-4 rounded-2xl outline-none font-bold"
                        value={cpf}
                        onChange={handleCpfChange}
                        required
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            className="w-full bg-white text-slate-900 p-4 rounded-2xl outline-none font-bold"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-check-green hover:bg-lime-500 text-check-blue font-black py-4 rounded-2xl text-xl transition-all flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
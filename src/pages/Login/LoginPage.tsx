import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import logoImg from '../../assets/logotipo.png';
import api from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const MySwal = withReactContent(Swal);

export default function LoginPage() {
    const navigate = useNavigate();
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    // Efeito de GPS corrigido
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    console.log("Localiza  o capturada com sucesso.");
                },
                (error) => {
                    console.warn("Erro ao obter localiza  o:", error.message);
                }
            );
        }
    }, []);

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
            // Aqui voc  pode enviar latitude e longitude no login se o seu backend suportar
            const response = await api.post('/Auth/login', {
                cpf: cpf.replace(/\D/g, ''),
                password,
                // latitude, // Opcional
                // longitude // Opcional
            });

            const { token, sellerId, name, role } = response.data;
            localStorage.setItem('@CheckVisit:token', token);
            localStorage.setItem('@CheckVisit:sellerId', sellerId);
            localStorage.setItem('@CheckVisit:sellerName', name);

            MySwal.fire({
                title: 'Sucesso!',
                text: `Bem-vindo, ${name}!`,
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
                title: 'Erro',
                text: err.response?.data || 'Erro no login.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-check-blue flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-md bg-check-card p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center">
                <img src={logoImg} alt="Logo" className="w-44 mb-8" />

                <h1 className="text-xl font-black italic mb-2 uppercase tracking-tighter"></h1>
                <p className="text-slate-400 mb-8 text-sm">Bom dia! Pronto para hoje?</p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <Input
                        label="CPF"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCpfChange}
                        required
                    />

                    <Input
                        label="Senha"
                        isPassword
                        placeholder="        "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" loading={loading}>
                        ENTRAR NO SISTEMA
                    </Button>
                </form>

                <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    FSI Point System   2026
                </p>
            </div>
        </div>
    );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, MapPin, Building2, Navigation, Loader2, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { HeaderAdmin } from '../../../components/HeaderAdmin';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { customerService } from '../../../services/customerService';

const MySwal = withReactContent(Swal);

export default function AdminCustomerCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);

    const [address, setAddress] = useState({
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    const handleAddressChange = (field: string, value: string) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    // 1. BUSCA AUTOMÁTICA DE CEP (ViaCEP)
    const handleCepBlur = async () => {
        const cep = address.zipCode.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setAddress(prev => ({
                    ...prev,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }));
            }
        } catch (err) {
            console.error("Erro ao buscar CEP");
        }
    };

    // 2. CAPTURA DE GEOLOCALIZAÇÃO ATUAL
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toString());
                setLongitude(position.coords.longitude.toString());
                setLocating(false);
            },
            () => setLocating(false),
            { enableHighAccuracy: true }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await customerService.create({
                companyName,
                cnpj: cnpj.replace(/\D/g, ''),
                address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            });
            MySwal.fire({ title: 'Sucesso!', icon: 'success', timer: 2000, showConfirmButton: false });
            navigate('/admin/customers/list');
        } catch (err: any) {
            MySwal.fire({ title: 'Erro', text: err.response?.data?.message, icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            <HeaderAdmin userName="RODRIGO FURLANETTI" onLogout={() => navigate('/')} />
            <main className="p-6 pt-12 max-w-4xl mx-auto">
                <button onClick={() => navigate('/admin/customers/list')} className="flex items-center gap-2 text-slate-500 mb-8 uppercase text-[10px] font-bold tracking-widest hover:text-check-green">
                    <ArrowLeft size={16} /> {t('cancel_button')}
                </button>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Seção Empresa */}
                    <div className="bg-check-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Building2 className="text-check-green" size={24} />
                            <h2 className="text-xl font-black uppercase italic tracking-tighter">Dados da Empresa</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Nome da Empresa" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                            <Input label="CNPJ" placeholder="00.000.000/0000-00" value={cnpj} onChange={e => setCnpj(e.target.value)} required />
                        </div>
                    </div>

                    {/* Seção Endereço e GPS */}
                    <div className="bg-check-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="text-check-green" size={24} />
                            <h2 className="text-xl font-black uppercase italic tracking-tighter">Endereço e Geolocalização</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input label="CEP" value={address.zipCode} onBlur={handleCepBlur} onChange={e => handleAddressChange('zipCode', e.target.value)} required />
                                <div className="md:col-span-2">
                                    <Input label="Logradouro" value={address.street} onChange={e => handleAddressChange('street', e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input label="Número" value={address.number} onChange={e => handleAddressChange('number', e.target.value)} required />
                                <Input label="Bairro" value={address.neighborhood} onChange={e => handleAddressChange('neighborhood', e.target.value)} required />
                                <Input label="Complemento" value={address.complement} onChange={e => handleAddressChange('complement', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                                <Input label="Cidade" value={address.city} onChange={e => handleAddressChange('city', e.target.value)} required />
                                <Input label="Estado (UF)" value={address.state} onChange={e => handleAddressChange('state', e.target.value)} required />
                            </div>

                            {/* GPS: MANUAL OU AUTOMÁTICO */}
                            <div className="pt-6">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Coordenadas de Check-in</label>
                                <div className="flex flex-col md:flex-row items-end gap-4">
                                    <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                                        <Input label="Latitude" type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} required />
                                        <Input label="Longitude" type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} required />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGetCurrentLocation}
                                        className="h-[52px] px-6 rounded-2xl bg-check-green text-check-blue hover:scale-105 transition-all flex items-center gap-2 text-xs font-black uppercase italic disabled:opacity-50 shadow-lg shadow-check-green/20"
                                    >
                                        {locating ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                                        {locating ? 'Localizando...' : 'Pegar Atual'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" loading={loading} className="w-full flex gap-3 justify-center py-4 text-lg uppercase font-black italic">
                        <Save size={24} /> Finalizar Cadastro
                    </Button>
                </form>
            </main>
        </div>
    );
}
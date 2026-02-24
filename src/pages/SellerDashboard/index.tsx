import { useEffect, useState, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import { Dialog, Transition } from '@headlessui/react';
import { LogOut, User, MapPin, Building2, CheckCircle2, Loader2, X, Navigation } from 'lucide-react';
import L from 'leaflet';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const mapIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [20, 20],
});
interface Customer {
    id: string;
    companyName: string;
    cnpj: string;
    address: string;
    latitude: number;
    longitude: number;
}
export default function SellerDashboard() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        async function loadCustomers() {
            try {
                const token = localStorage.getItem('@CheckVisit:token');
                const response = await api.get('/Customer', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCustomers(response.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        loadCustomers();
    }, []);
    const handleCheckIn = async (customer: Customer) => {
        const result = await MySwal.fire({
            title: 'Iniciar Visita?',
            html: `Deseja registrar chegada em:<br><b style="color: #84cc16">${customer.companyName}</b>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#84cc16',
            cancelButtonColor: '#334151',
            confirmButtonText: 'Sim, fazer check-in',
            cancelButtonText: 'Cancelar',
            background: '#1e293b',
            color: '#fff'
        });
        if (!result.isConfirmed) return;
        MySwal.fire({
            title: 'Obtendo GPS...',
            html: 'Aguarde a validação da sua localização.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); },
            background: '#1e293b',
            color: '#fff'
        });
        if (!navigator.geolocation) {
            return MySwal.fire({ title: 'Erro', text: 'GPS não suportado.', icon: 'error', background: '#1e293b', color: '#fff' });
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const token = localStorage.getItem('@CheckVisit:token');
                const sellerId = localStorage.getItem('@CheckVisit:sellerId');
                if (!sellerId) {
                    throw new Error("Sessão expirada. Por favor, faça login novamente.");
                }
                await api.post('/Visit/checkin', {
                    customerId: customer.id,
                    sellerId: sellerId, 
                    latitude: latitude,
                    longitude: longitude
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                MySwal.fire({
                    title: 'Sucesso!',
                    text: 'Check-in realizado com sucesso!',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });

            } catch (err: any) {
                console.error(err);
                MySwal.fire({
                    title: 'Falha no Check-in',
                    text: err.response?.data?.message || err.message || 'Erro ao registrar visita.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        }, (error) => {
            MySwal.fire({ title: 'Erro de GPS', text: 'Ative o GPS.', icon: 'error', background: '#1e293b', color: '#fff' });
        }, { enableHighAccuracy: true });
    };

    const handleCheckOut = async (customer: Customer) => {
        const { value: text, isConfirmed } = await MySwal.fire({
            title: 'Finalizar Visita',
            input: 'textarea',
            inputLabel: `Resumo da visita em ${customer.companyName}`,
            inputPlaceholder: 'O que foi resolvido?',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334151',
            confirmButtonText: 'Confirmar Check-out',
            cancelButtonText: 'Voltar',
            background: '#1e293b',
            color: '#fff',
            inputValidator: (value) => {
                if (!value) return 'O resumo é obrigatório para encerrar!';
            }
        });
        if (!isConfirmed) return;
        MySwal.fire({
            title: 'Obtendo localização de saída...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); },
            background: '#1e293b',
            color: '#fff'
        });
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const token = localStorage.getItem('@CheckVisit:token');
                    const sellerId = localStorage.getItem('@CheckVisit:sellerId');
                    await api.post('/Visit/checkout', {
                        sellerId: sellerId,
                        customerId: customer.id,
                        latitude: latitude,   
                        longitude: longitude,  
                        summaryCheckOut: text
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    MySwal.fire({
                        title: 'Finalizado!',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff',
                        timer: 2000,
                        showConfirmButton: false
                    });

                } catch (err: any) {
                    console.error("Erro no checkout:", err);
                    MySwal.fire({
                        title: 'Erro no Check-out',
                        text: err.response?.data?.message || 'Erro ao comunicar com o servidor.',
                        icon: 'error',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            },
            (error) => {
                MySwal.fire({
                    title: 'GPS Falhou',
                    text: 'Não conseguimos validar sua posição de saída.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff'
                });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };
    return (
        <div className="min-h-screen bg-check-blue text-white font-sans pb-10">
            {/* Header */}
            <header className="bg-check-card/80 backdrop-blur-md p-6 rounded-b-[2.5rem] shadow-2xl border-b border-white/5 flex items-center justify-between sticky top-0 z-[40]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-check-green rounded-2xl flex items-center justify-center text-check-blue shadow-lg">
                        <User size={24} strokeWidth={3} />
                    </div>
                    <h2 className="text-lg font-black tracking-tighter italic">CheckVisit</h2>
                </div>
                <button onClick={() => window.location.href = '/'} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-red-400">
                    <LogOut size={20} />
                </button>
            </header>

            <main className="p-6 grid gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-check-green" size={42} />
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Sincronizando Dados</p>
                    </div>
                ) : (
                    customers.map((customer) => (
                        <div key={customer.id} className="bg-check-card p-4 rounded-[2rem] border border-white/5 flex items-center justify-between shadow-xl transition-all active:scale-[0.98]">
                            <div className="flex gap-4 items-center cursor-pointer flex-1" onClick={() => setSelectedCustomer(customer)}>
                                <div className="p-3 bg-check-blue rounded-2xl text-check-green shadow-inner">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-sm text-white uppercase leading-tight">{customer.companyName}</h4>
                                    <div className="flex items-center gap-1 text-slate-500 mt-1">
                                        <MapPin size={10} />
                                        <span className="text-[9px] font-bold uppercase">Ver Localização</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCheckIn(customer)}
                                className="bg-check-green hover:bg-lime-500 text-check-blue px-5 py-3 rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 shadow-lg shadow-check-green/20"
                            >
                                <CheckCircle2 size={16} strokeWidth={3} />
                                Check-in
                            </button>

                            <button
                                    onClick={() => handleCheckOut(customer)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 shadow-lg shadow-red-500/20"
                                >
                                    <LogOut size={16} strokeWidth={3} />
                                    Check-out
                            </button>
                        </div>
                    ))
                )}
            </main>

            {/* MODAL CENTRALIZADO COM DESIGN PREMIUM */}
            <Transition appear show={!!selectedCustomer} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedCustomer(null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-check-blue/95 backdrop-blur-xl" aria-hidden="true" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-90 translate-y-10"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-90"
                        >
                            <Dialog.Panel className="w-full max-w-lg bg-check-card border-[6px] border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)]">
                                <div className="p-8 pb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="p-3 bg-check-green text-check-blue rounded-2xl">
                                            <Navigation size={22} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                                                {selectedCustomer?.companyName}
                                            </Dialog.Title>
                                            <p className="text-[10px] text-check-green font-bold uppercase tracking-widest mt-1">Mapa de Destino</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedCustomer(null)} className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-2xl">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="px-6 pb-2">
                                    <div className="h-[380px] w-full rounded-[2.5rem] overflow-hidden border-2 border-white/5 shadow-inner">
                                        {selectedCustomer && (
                                            <MapContainer
                                                center={[selectedCustomer.latitude, selectedCustomer.longitude]}
                                                zoom={16}
                                                zoomControl={false}
                                                className="h-full w-full"
                                                key={selectedCustomer.id}
                                            >
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker
                                                    position={[selectedCustomer.latitude, selectedCustomer.longitude]}
                                                    icon={mapIcon}
                                                />
                                                <ZoomControl position="bottomright" />
                                            </MapContainer>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <button
                                        onClick={() => setSelectedCustomer(null)}
                                        className="w-full bg-white/5 hover:bg-check-green hover:text-check-blue text-white font-black py-5 rounded-[2rem] uppercase text-xs tracking-[0.2em] transition-all duration-300"
                                    >
                                        Fechar Visualização
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
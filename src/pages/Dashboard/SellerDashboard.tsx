import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Importação dos componentes refatorados
import { Header } from '../../components/Header';
import { CustomerCard } from '../../components/CustomerCard';
import { MapModal } from '../../components/MapModal';

const MySwal = withReactContent(Swal);


export default function SellerDashboard() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [sellerName, setSellerName] = useState('Vendedor');

    useEffect(() => {
        async function loadInitialData() {
            try {
                const storedName = localStorage.getItem('@CheckVisit:sellerName');
                const token = localStorage.getItem('@CheckVisit:token');

                if (storedName) setSellerName(storedName);
                if (!token) {
                    window.location.href = '/';
                    return;
                }

                const response = await api.get('/Customer', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setCustomers(response.data);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            } finally {
                setLoading(false);
            }
        }
        loadInitialData();
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
            background: '#1e293b',
            color: '#fff'
        });

        if (!result.isConfirmed) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const token = localStorage.getItem('@CheckVisit:token');
                const sellerId = localStorage.getItem('@CheckVisit:sellerId');

                await api.post('/Visit/checkin', {
                    customerId: customer.id,
                    sellerId, latitude, longitude
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                MySwal.fire({ title: 'Check-in Realizado!', icon: 'success', background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });
            } catch (err: any) {
                MySwal.fire({ title: 'Erro', text: 'Erro ao registrar check-in.', icon: 'error', background: '#1e293b', color: '#fff' });
            }
        }, null, { enableHighAccuracy: true });
    };

    const handleCheckOut = async (customer: Customer) => {
        const { value: text, isConfirmed } = await MySwal.fire({
            title: 'Finalizar Visita',
            input: 'textarea',
            inputLabel: `Resumo da visita em ${customer.companyName}`,
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Finalizar',
            background: '#1e293b',
            color: '#fff',
            inputValidator: (value) => !value && 'O resumo é obrigatório!'
        });

        if (!isConfirmed) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const token = localStorage.getItem('@CheckVisit:token');
                const sellerId = localStorage.getItem('@CheckVisit:sellerId');

                await api.post('/Visit/checkout', {
                    sellerId, customerId: customer.id, latitude, longitude, summaryCheckOut: text
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                MySwal.fire({ title: 'Visita Encerrada!', icon: 'success', background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });
            } catch (err: any) {
                MySwal.fire({ title: 'Erro', text: 'Erro ao encerrar visita.', icon: 'error', background: '#1e293b', color: '#fff' });
            }
        }, null, { enableHighAccuracy: true });
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans pb-10">
            <Header userName={sellerName} onLogout={handleLogout} />

            <main className="p-6 grid gap-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-check-green" size={42} />
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Sincronizando Clientes</p>
                    </div>
                ) : (
                    customers.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onSelect={setSelectedCustomer}
                            onCheckIn={handleCheckIn}
                            onCheckOut={handleCheckOut}
                        />
                    ))
                )}
            </main>

            <MapModal
                customer={selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
            />
        </div>
    );
}
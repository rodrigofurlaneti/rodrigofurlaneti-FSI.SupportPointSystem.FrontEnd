import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import { Navigation, X } from 'lucide-react';
import L from 'leaflet';

// Ícone movido para dentro do componente ou para um arquivo de config
const mapIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #84cc16; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #1e293b; box-shadow: 0 0 10px rgba(132, 204, 22, 0.5);"></div>`,
    iconSize: [20, 20],
});

interface MapModalProps {
    customer: any | null;
    onClose: () => void;
}

export function MapModal({ customer, onClose }: MapModalProps) {
    return (
        <Transition appear show={!!customer} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <div className="fixed inset-0 bg-check-blue/95 backdrop-blur-xl" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200">
                        <Dialog.Panel className="w-full max-w-lg bg-check-card border-[1px] border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                            <div className="p-8 pb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-check-green/10 p-3 rounded-2xl text-check-green"><Navigation size={24} /></div>
                                    <button onClick={onClose} className="p-2 bg-white/5 text-slate-400 rounded-xl"><X size={20} /></button>
                                </div>
                                <Dialog.Title as="h3" className="text-2xl font-black text-white uppercase leading-none mb-2">{customer?.companyName}</Dialog.Title>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mt-4">
                                    <p className="text-[11px] text-check-green font-black uppercase tracking-widest mb-1">Endereço Completo</p>
                                    <p className="text-sm text-slate-300 font-medium">{customer?.fullAddress}</p>
                                </div>
                            </div>
                            <div className="px-6">
                                <div className="h-[250px] w-full rounded-[2rem] overflow-hidden border border-white/10">
                                    {customer && (
                                        <MapContainer center={[customer.latitude, customer.longitude]} zoom={16} zoomControl={false} className="h-full w-full">
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker position={[customer.latitude, customer.longitude]} icon={mapIcon} />
                                            <ZoomControl position="bottomright" />
                                        </MapContainer>
                                    )}
                                </div>
                            </div>
                            <div className="p-8">
                                <button onClick={onClose} className="w-full bg-check-green text-check-blue font-black py-5 rounded-2xl uppercase text-xs tracking-widest">Fechar Mapa</button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
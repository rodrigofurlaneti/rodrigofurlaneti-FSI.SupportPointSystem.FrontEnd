import { Building2, MapPin, CheckCircle2, LogOut } from 'lucide-react';

interface CustomerCardProps {
    customer: any; // Use sua interface Customer aqui
    onSelect: (customer: any) => void;
    onCheckIn: (customer: any) => void;
    onCheckOut: (customer: any) => void;
}

export function CustomerCard({ customer, onSelect, onCheckIn, onCheckOut }: CustomerCardProps) {
    return (
        <div className="bg-check-card p-5 rounded-[2.5rem] border border-white/5 shadow-xl transition-all active:scale-[0.98]">
            <div className="flex gap-4 items-start cursor-pointer mb-5" onClick={() => onSelect(customer)}>
                <div className="p-4 bg-check-blue rounded-2xl text-check-green shadow-inner">
                    <Building2 size={28} />
                </div>
                <div className="flex-1">
                    <h4 className="font-black text-base text-white uppercase leading-tight tracking-tight">{customer.companyName}</h4>
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-check-green">
                            <MapPin size={12} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-wider">
                                {customer.address.city} - {customer.address.state}
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-1">
                            {customer.address.street}, {customer.address.number} - {customer.address.neighborhood}
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => onCheckIn(customer)} className="bg-check-green hover:bg-lime-500 text-check-blue py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-check-green/10">
                    <CheckCircle2 size={16} strokeWidth={3} /> Check-in
                </button>
                <button onClick={() => onCheckOut(customer)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
                    <LogOut size={16} strokeWidth={3} /> Check-out
                </button>
            </div>
        </div>
    );
}
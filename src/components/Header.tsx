import { User, LogOut } from 'lucide-react';

interface HeaderProps {
    userName: string;
    onLogout: () => void;
}

export function Header({ userName, onLogout }: HeaderProps) {
    return (
        <header className="bg-check-card/80 backdrop-blur-md p-6 rounded-b-[2.5rem] shadow-2xl border-b border-white/5 flex items-center justify-between sticky top-0 z-[40]">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-check-green rounded-2xl flex items-center justify-center text-check-blue shadow-lg">
                    <User size={24} strokeWidth={3} />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Vendedor</p>
                    <h2 className="text-lg font-black tracking-tighter italic leading-none">{userName}</h2>
                </div>
            </div>
            <button
                onClick={onLogout}
                className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
            >
                <LogOut size={20} />
            </button>
        </header>
    );
}
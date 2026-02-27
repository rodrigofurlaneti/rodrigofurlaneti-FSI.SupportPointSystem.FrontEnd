import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Users, Landmark, MapPin, ChevronDown,
    PlusCircle, List, BarChart3
} from 'lucide-react';

// Importando o novo HeaderAdmin específico (Rodrigo Furlanetti)
import { HeaderAdmin } from '../../components/HeaderAdmin';

export default function AdminDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openSection, setOpenSection] = useState<string | null>('sellers');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    // Definição das seções com os caminhos para os novos arquivos de Sellers e Customers
    const sections = [
        {
            id: 'sellers',
            title: t('manage_sellers'),
            icon: <Users size={28} />,
            color: 'text-check-green',
            actions: [
                { label: t('add_new'), icon: <PlusCircle size={20} />, path: '/admin/sellers/new' },
                { label: t('list_all'), icon: <List size={20} />, path: '/admin/sellers/list' },
                { label: t('performance'), icon: <BarChart3 size={20} />, path: '/admin/sellers/performance' },
            ]
        },
        {
            id: 'customers',
            title: t('manage_customers'),
            icon: <Landmark size={28} />,
            color: 'text-blue-400',
            actions: [
                { label: t('add_new'), icon: <PlusCircle size={20} />, path: '/admin/customers/new' },
                { label: t('list_all'), icon: <List size={20} />, path: '/admin/customers/list' },
                { label: t('view_map'), icon: <MapPin size={20} />, path: '/admin/customers/map' },
            ]
        },
        {
            id: 'visits',
            title: t('visit_history'),
            icon: <MapPin size={28} />,
            color: 'text-purple-400',
            actions: [
                { label: t('recent_checkins'), icon: <List size={20} />, path: '/admin/visits/list' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-check-blue text-white font-sans">
            {/* HeaderAdmin personalizado com suporte a multi-idiomas e perfil admin */}
            <HeaderAdmin userName="RODRIGO FURLANETTI" onLogout={handleLogout} />

            <main className="p-6 pt-12 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-tight">
                        {t('admin_panel_title')}
                    </h2>
                    <div className="h-1.5 w-24 bg-check-green mx-auto rounded-full shadow-[0_0_15px_rgba(132,204,22,0.4)]"></div>
                </div>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-check-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500"
                        >
                            {/* Gatilho da Sanfona */}
                            <button
                                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                                className="w-full p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors outline-none group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`p-5 rounded-[1.5rem] bg-white/5 ${section.color} shadow-inner group-hover:scale-110 transition-transform`}>
                                        {section.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                                            {section.title}
                                        </h3>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
                                            {t('available_actions')}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`text-slate-600 transition-transform duration-500 ${openSection === section.id ? 'rotate-180' : ''}`}
                                    size={28}
                                />
                            </button>

                            {/* Conteúdo Expansível (Grid de Ações) */}
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openSection === section.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-8 pb-10 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 mt-2">
                                    {section.actions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => action.path && navigate(action.path)}
                                            className="flex flex-col items-center justify-center gap-4 p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-check-green hover:text-check-blue transition-all duration-300 group/btn"
                                        >
                                            <div className="text-check-green group-hover/btn:text-check-blue transition-colors scale-125">
                                                {action.icon}
                                            </div>
                                            <span className="font-black text-[11px] uppercase tracking-widest text-center leading-tight">
                                                {action.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="text-center mt-20 opacity-20">
                    <p className="text-[10px] font-bold uppercase tracking-[0.6em]">
                        FSI Point System • Management Suite 2026
                    </p>
                </footer>
            </main>
        </div>
    );
}
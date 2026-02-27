import { useTranslation } from 'react-i18next';
import { LogOut, UserCog, Globe } from 'lucide-react';

interface HeaderAdminProps {
    userName: string;
    onLogout: () => void;
}

export function HeaderAdmin({ userName, onLogout }: HeaderAdminProps) {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="w-full bg-check-card p-6 rounded-b-[2.5rem] shadow-2xl border-b border-white/5 relative z-[100]">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Perfil do Administrador - Identidade Visual Diferenciada */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-check-green rounded-2xl flex items-center justify-center shadow-lg shadow-check-green/20">
                        <UserCog className="text-check-blue" size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">
                            {t('admin_panel_title') || 'Painel Administrativo'}
                        </span>
                        <h2 className="text-white font-black italic uppercase tracking-tighter text-lg leading-tight">
                            {userName}
                        </h2>
                    </div>
                </div>

                {/* Área de Ações: Idioma + Logout */}
                <div className="flex items-center gap-6">
                    {/* Seletor de Idiomas embutido e alinhado */}
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                        <Globe size={14} className="text-slate-500" />
                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            value={i18n.language}
                            className="bg-transparent text-[10px] font-bold text-white outline-none cursor-pointer uppercase tracking-wider focus:ring-0"
                        >
                            <option value="pt" className="bg-check-card text-white">Português 🇧🇷</option>
                            <option value="en" className="bg-check-card text-white">English 🇺🇸</option>
                            <option value="es" className="bg-check-card text-white">Español 🇪🇸</option>
                            <option value="fr" className="bg-check-card text-white">Français 🇫🇷</option>
                            <option value="zh" className="bg-check-card text-white">中文 🇨🇳</option>
                        </select>
                    </div>

                    <button
                        onClick={onLogout}
                        className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all group"
                        title={t('logout') || 'Sair'}
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
}
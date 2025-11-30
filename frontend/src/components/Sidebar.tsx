import { useState, useEffect } from 'react';
import { 
    Calendar as CalendarIcon, 
    LogOut, 
    User, 
    Shield,
    Stethoscope
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    active: 'agenda' | 'admin';
}

export function Sidebar({ active }: SidebarProps) {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const role = localStorage.getItem('userRole') || 'membro';
        setUserRole(role);
    }, []);

    const isAdmin = userRole === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
            {/* Logo */}
            <div className="p-8 flex items-center gap-3">
                <div className="bg-purple-600 text-white p-2 rounded-xl">
                    <Stethoscope size={24} />
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">Hospital Oliveira de Menezes</span>
            </div>

            {/* Menu Itens */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Menu Principal
                </p>
                
                <button 
                    onClick={() => navigate('/dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                        active === 'agenda' 
                        ? 'bg-purple-50 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <CalendarIcon size={20} />
                    Agenda
                </button>
                
                {isAdmin && (
                    <button 
                        onClick={() => navigate('/admin')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            active === 'admin' 
                            ? 'bg-purple-50 text-purple-700' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Shield size={20} />
                        Administração
                    </button>
                )}
            </nav>

            {/* Footer do Menu */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border border-purple-200">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Dr. Usuário</p>
                        <p className="text-xs text-purple-600 font-medium uppercase">{userRole || 'Médico'}</p>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    Sair do Sistema
                </button>
            </div>
        </aside>
    );
}
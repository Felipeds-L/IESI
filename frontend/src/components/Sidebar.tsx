import { useState, useEffect } from 'react';
import { 
    Calendar as CalendarIcon, 
    LogOut, 
    User, 
    Shield,
    Stethoscope,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    active: 'agenda' | 'admin' | 'pacientes';
}

export function Sidebar({ active }: SidebarProps) {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string>('');
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        const updateUserData = () => {
            const role = localStorage.getItem('userRole') || 'membro';
            const name = localStorage.getItem('userName') || 'Usuário';
            setUserRole(role);
            setUserName(name);
        };
        
        updateUserData();
        
        // Atualiza quando o storage muda
        window.addEventListener('storage', updateUserData);
        
        // Verifica mudanças periodicamente (para mudanças na mesma aba)
        const interval = setInterval(updateUserData, 1000);
        
        return () => {
            window.removeEventListener('storage', updateUserData);
            clearInterval(interval);
        };
    }, []);

    const isAdmin = userRole === 'admin' || userRole === 'administrativo';

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('funcionarioId');
        navigate('/login');
    };

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
            {/* Logo */}
            <div className="p-6 flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-3 rounded-2xl shadow-lg">
                    <img 
                        src="/asset/imagem_2025-12-12_144309060-removebg-preview.png" 
                        alt="HeathLink Logo" 
                        className="w-12 h-12 object-contain"
                    />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent tracking-tight">HeathLink</span>
            </div>

            {/* Menu Itens */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <p className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                
                <button 
                    onClick={() => navigate('/pacientes')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                        active === 'pacientes' 
                        ? 'bg-purple-50 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Users size={20} />
                    Pacientes
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
                        <p className="text-base font-bold text-gray-800">{userName}</p>
                        <p className="text-sm text-purple-600 font-medium uppercase">
                            {userRole === 'administrativo' || userRole === 'admin' 
                                ? 'Administrador' 
                                : userRole === 'medico' 
                                ? 'Médico' 
                                : userRole || 'Usuário'}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-base font-medium"
                >
                    <LogOut size={18} />
                    Sair do Sistema
                </button>
            </div>
        </aside>
    );
}
import { useState, useEffect } from 'react';
import { 
    Check, 
    X, 
    User, 
    Activity, 
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// IMPORTAMOS O COMPONENTE SIDEBAR
import { Sidebar } from '../../components/Sidebar';

// --- Interfaces Mockadas ---
interface RegistrationRequest {
    id: number;
    name: string;
    cpf: string;
    role: string;
    date: string;
}

interface SystemLog {
    id: number;
    user: string;
    action: string;
    target: string;
    time: string;
    type: 'info' | 'warning' | 'error';
}

// --- Dados Mockados ---
const initialRequests: RegistrationRequest[] = [
    { id: 1, name: 'Dra. Juliana Paes', cpf: '123.***.***-00', role: 'Médico', date: '30/11/2025' },
    { id: 2, name: 'Enf. Ricardo Oliveira', cpf: '456.***.***-99', role: 'Enfermeiro', date: '29/11/2025' },
    { id: 3, name: 'Recepção Tarde', cpf: '789.***.***-11', role: 'Recepção', date: '28/11/2025' },
];

const initialLogs: SystemLog[] = [
    { id: 1, user: 'Dr. Usuário', action: 'Criou Agendamento', target: 'Paciente Pedro Silva', time: '10:05', type: 'info' },
    { id: 2, user: 'Dr. Usuário', action: 'Editou Prontuário', target: 'Paciente Sofia Martins', time: '09:45', type: 'info' },
    { id: 3, user: 'Sistema', action: 'Falha de Login', target: 'IP 192.168.1.15', time: '08:30', type: 'warning' },
    { id: 4, user: 'Admin', action: 'Removeu Usuário', target: 'Dr. Antigo', time: 'Ontem', type: 'error' },
];

export default function AdminPage() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState(initialRequests);
    const [logs] = useState(initialLogs);

    useEffect(() => {
        const role = localStorage.getItem('userRole') || 'membro';
        // Segurança simples: Se não for admin, chuta pro dashboard
        if (role !== 'admin') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleApprove = (id: number) => {
        // Lógica de aprovação aqui (backend)
        setRequests(prev => prev.filter(req => req.id !== id));
        alert(`Usuário ${id} aprovado!`);
    };

    const handleReject = (id: number) => {
        // Lógica de rejeição aqui
        setRequests(prev => prev.filter(req => req.id !== id));
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-base">
            
            {/* USANDO O COMPONENTE SIDEBAR AQUI (ATIVO EM 'admin') */}
            <Sidebar active="admin" />

            {/* --- CONTEÚDO DA ADMINISTRAÇÃO --- */}
            {/* Margem à esquerda (ml-72) para compensar a sidebar fixa */}
            <main className="flex-1 ml-72 p-8">
                <div className="max-w-7xl mx-auto">
                    
                    <header className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Painel Administrativo</h1>
                        <p className="text-gray-500 font-medium">Gerencie acessos e monitore a atividade do sistema.</p>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* CARD 1: Solicitações de Cadastro */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <User className="text-purple-600" size={20} />
                                    Solicitações de Acesso
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{requests.length}</span>
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                {requests.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Nenhuma solicitação pendente.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {requests.map(req => (
                                            <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                                <div>
                                                    <p className="font-bold text-gray-800">{req.name}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                                        <span>{req.role}</span> • <span>{req.cpf}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">Solicitado em: {req.date}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleReject(req.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Rejeitar"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleApprove(req.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Aprovar"
                                                    >
                                                        <Check size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* CARD 2: Logs do Sistema */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Activity className="text-blue-600" size={20} />
                                    Atividades Recentes
                                </h2>
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                {logs.map(log => (
                                    <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                            log.type === 'error' ? 'bg-red-500' : 
                                            log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                        <div className="flex-1">
                                            <p className="text-gray-800 font-medium">
                                                <span className="font-bold">{log.user}</span> {log.action}
                                            </p>
                                            <p className="text-sm text-gray-500">{log.target}</p>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                            <Clock size={12} /> {log.time}
                                        </div>
                                    </div>
                                ))}
                                <div className="p-4 text-center">
                                    <button className="text-sm text-purple-600 font-medium hover:underline">
                                        Ver histórico completo
                                    </button>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}
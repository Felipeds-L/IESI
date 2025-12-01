import { useState, useEffect } from 'react';
import { 
    Check, 
    X, 
    User, 
    Activity, 
    Clock,
    Search,
    ChevronLeft,
    ChevronRight,
    FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Sidebar } from '../../components/Sidebar';

// --- Interfaces ---
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
    fullDate: string;
    type: 'info' | 'warning' | 'error';
}

// --- Gerador de mocks ---
const generateMockData = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR');

    const requests: RegistrationRequest[] = [
        { id: 1, name: 'Dra. Juliana Paes', cpf: '123.***.***-00', role: 'Médico', date: dateStr },
        { id: 2, name: 'Enf. Ricardo Oliveira', cpf: '456.***.***-99', role: 'Enfermeiro', date: dateStr },
        { id: 3, name: 'Recepção Tarde', cpf: '789.***.***-11', role: 'Recepção', date: dateStr },
    ];

    // Histórico
    const logs: SystemLog[] = Array.from({ length: 25 }).map((_, index) => {
        const types: ('info' | 'warning' | 'error')[] = ['info', 'info', 'info', 'warning', 'error'];
        const actions = ['Criou Agendamento', 'Editou Prontuário', 'Visualizou Relatório', 'Falha de Login', 'Removeu Usuário'];
        const users = ['Dr. Usuário', 'Admin', 'Recepção', 'Sistema', 'Enf. Ricardo'];
        
        // Simula horários decrescentes
        const logTime = new Date(today.getTime() - index * 1000 * 60 * 45); // A cada 45 min atrás
        
        return {
            id: index + 1,
            user: users[index % users.length],
            action: actions[index % actions.length],
            target: index % 2 === 0 ? `Paciente ${index}` : 'Sistema',
            time: logTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            fullDate: logTime.toLocaleDateString('pt-BR'),
            type: types[index % types.length]
        };
    });

    return { requests, logs };
};

const { requests: initialRequests, logs: initialLogs } = generateMockData();

const ITEMS_PER_PAGE = 8;

export default function AdminPage() {
    const navigate = useNavigate();
    
    // --- Estados ---
    const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
    const [requests, setRequests] = useState(initialRequests);
    const [logs, setLogs] = useState(initialLogs); // Lista completa de logs
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // --- Segurança e Inicialização ---
    useEffect(() => {
        const role = localStorage.getItem('userRole') || 'membro';
        if (role !== 'admin') {
            toast.error("Acesso negado. Área restrita a administradores.");
            navigate('/dashboard');
        }
    }, [navigate]);

    // Resetar paginação ao buscar ou trocar aba
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab]);

    // --- Handlers de Solicitações ---
    const handleApprove = (id: number) => {
        const req = requests.find(r => r.id === id);
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.success(`Acesso aprovado para ${req?.name}!`);
        
        // Adiciona um log de sistema simulando a ação
        const newLog: SystemLog = {
            id: Date.now(),
            user: 'Admin (Você)',
            action: 'Aprovou Cadastro',
            target: req?.name || 'Usuário',
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            fullDate: new Date().toLocaleDateString('pt-BR'),
            type: 'info'
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const handleReject = (id: number) => {
        const req = requests.find(r => r.id === id);
        if (confirm(`Rejeitar solicitação de ${req?.name}?`)) {
            setRequests(prev => prev.filter(r => r.id !== id));
            toast.info(`Solicitação de ${req?.name} rejeitada.`);
        }
    };

    // --- Lógica de Filtro e Paginação (Logs) ---
    const getFilteredLogs = () => {
        return logs.filter(log => 
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredLogs = getFilteredLogs();
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Logs recentes para a "Visão Geral" (apenas os 5 primeiros)
    const recentLogs = logs.slice(0, 5);

    // Função auxiliar para mudar página
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-base">
            
            <Sidebar active="admin" />

            {/* Margem à esquerda para Sidebar */}
            <main className="flex-1 ml-72 p-8">
                <div className="max-w-8xl mx-auto">
                    
                    {/* Header Principal */}
                    <header className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Painel Administrativo</h1>
                            <p className="text-gray-500 font-medium">Gerencie acessos e monitore a integridade do sistema.</p>
                        </div>
                    </header>

                    {/* Controles: Abas e Busca */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="bg-white p-1 rounded-xl inline-flex shadow-sm border border-gray-100 whitespace-nowrap">
                            <button 
                                onClick={() => setActiveTab('overview')} 
                                className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                
                                Visão Geral
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')} 
                                className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ml-2 ${activeTab === 'history' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                
                                Histórico do Sistema
                            </button>
                        </div>

                        {/* Busca (Ativa apenas se estiver no histórico ou se quiser filtrar globalmente) */}
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={activeTab === 'overview' ? "Buscar logs recentes..." : "Pesquisar no histórico..."}
                                className="w-full bg-white pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition shadow-sm text-base"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* --- CONTEÚDO DA ABA: VISÃO GERAL --- */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-500">
                            
                            {/* CARD 1: Solicitações de Cadastro */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <User className="text-purple-600" size={24} />
                                        Solicitações Pendentes
                                        {requests.length > 0 && (
                                            <span className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full animate-pulse">{requests.length}</span>
                                        )}
                                    </h2>
                                </div>
                                
                                <div className="p-6">
                                    {requests.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-green-500">
                                                <Check size={32} />
                                            </div>
                                            <p className="text-gray-500 text-lg">Tudo limpo! Nenhuma solicitação pendente.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {requests.map(req => (
                                                <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-lg">{req.name}</p>
                                                        <p className="text-base text-gray-500 flex items-center gap-2 mt-1">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-sm">{req.role}</span> 
                                                            <span className="text-sm">• {req.cpf}</span>
                                                        </p>
                                                        <p className="text-base text-gray-400 mt-1">Data: {req.date}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleReject(req.id)}
                                                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                                                            title="Rejeitar"
                                                        >
                                                            <X size={24} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleApprove(req.id)}
                                                            className="p-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100" 
                                                            title="Aprovar"
                                                        >
                                                            <Check size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* CARD 2: Logs Recentes (Resumo) */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <Activity className="text-blue-600" size={24} />
                                        Atividades Recentes
                                    </h2>
                                </div>
                                
                                <div className="divide-y divide-gray-100">
                                    {recentLogs.map(log => (
                                        <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                            <div className={`mt-2 w-3 h-3 rounded-full flex-shrink-0 ${
                                                log.type === 'error' ? 'bg-red-500 shadow-sm shadow-red-200' : 
                                                log.type === 'warning' ? 'bg-yellow-500 shadow-sm shadow-yellow-200' : 'bg-blue-500 shadow-sm shadow-blue-200'
                                            }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-800 text-base">
                                                    <span className="font-bold">{log.user}</span> <span className="text-gray-600">{log.action.toLowerCase()}</span>
                                                </p>
                                                <p className="text-base text-gray-500 truncate">{log.target}</p>
                                            </div>
                                            <div className="text-sm text-gray-400 font-medium whitespace-nowrap flex items-center gap-1">
                                                <Clock size={16} /> {log.time}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="p-4 text-center bg-gray-50/30 border-t border-gray-100">
                                        <button 
                                            onClick={() => setActiveTab('history')}
                                            className="text-base text-purple-600 font-medium hover:text-purple-700 hover:underline transition-colors"
                                        >
                                            Ver histórico completo
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* --- CONTEÚDO DA ABA: HISTÓRICO COMPLETO --- */}
                    {activeTab === 'history' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FileText className="text-purple-600" size={24} />
                                    Registro Completo de Auditoria
                                </h2>
                                <span className="text-base text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                                    Total: {filteredLogs.length} registros
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-base text-gray-600">
                                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 w-10">#</th>
                                            <th className="p-4">Usuário</th>
                                            <th className="p-4">Ação</th>
                                            <th className="p-4">Alvo/Detalhes</th>
                                            <th className="p-4">Data e Hora</th>
                                            <th className="p-4">Tipo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-400 text-sm">{log.id}</td>
                                                <td className="p-4 font-medium text-gray-900">{log.user}</td>
                                                <td className="p-4">{log.action}</td>
                                                <td className="p-4 text-gray-500">{log.target}</td>
                                                <td className="p-4 font-mono text-base">
                                                    {log.fullDate} <span className="text-gray-400">às</span> {log.time}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                        log.type === 'error' ? 'bg-red-100 text-red-700' :
                                                        log.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                        {log.type === 'warning' ? 'AVISO' : log.type === 'error' ? 'ERRO' : 'INFO'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação do Histórico (Estilo Dashboard) */}
                            {totalPages > 1 && (
                                <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex justify-center items-center gap-2">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:text-purple-600 text-gray-600 disabled:opacity-50 transition"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-lg font-medium transition text-base ${
                                                currentPage === page 
                                                ? 'bg-purple-600 text-white shadow-md' 
                                                : 'text-gray-600 bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:text-purple-600 text-gray-600 disabled:opacity-50 transition"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    X,
    Users,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import { AppointmentCard } from '../../components/AppointmentCard';
import { EditAppointmentModal, AppointmentData } from '../../components/EditAppointmentModal';
// Importamos a Sidebar que criamos
import { Sidebar } from '../../components/Sidebar';

// --- Dados Iniciais Mockados ---
const initialData: AppointmentData[] = [
    { 
        id: 1, 
        date: '10/11', 
        time: '10:00', 
        patient: 'Pedro Silva', 
        doctor: 'Dra. Ana', 
        specialty: 'Cardiologia', 
        status: 'Confirmado', 
        doctorId: 'CRM-12345', 
        patientId: 'P-001', 
        patientGender: 'M', 
        patientAge: '45', 
        patientGuardian: 'Maria Silva (Esposa)', 
        problemDescription: 'Paciente relata dores no peito ao realizar esforço físico moderado.', 
        procedureType: 'Consulta de Rotina' 
    },
    { 
        id: 2, 
        date: '15/11', 
        time: '15:00', 
        patient: 'Sofia Martins', 
        doctor: 'Dr. Roberto', 
        specialty: 'Clínico Geral', 
        status: 'Pendente', 
        doctorId: 'CRM-98765', 
        patientId: 'P-002', 
        patientGender: 'F', 
        patientAge: '28', 
        patientGuardian: '-', 
        problemDescription: 'Check-up anual de rotina. Sem queixas específicas.', 
        procedureType: 'Exame Geral' 
    },
    { 
        id: 3, 
        date: '21/11', 
        time: '14:00', 
        patient: 'Julia Santos', 
        doctor: 'Dra. Ana', 
        specialty: 'Dermatologia', 
        status: 'Agendado', 
        doctorId: 'CRM-12345', 
        patientId: 'P-003', 
        patientGender: 'F', 
        patientAge: '19', 
        patientGuardian: 'Carlos Santos (Pai)', 
        problemDescription: 'Manchas avermelhadas no braço após exposição ao sol.', 
        procedureType: 'Avaliação Dermatológica' 
    },
    { 
        id: 4, 
        date: '23/11', 
        time: '17:00', 
        patient: 'Lucas Oliveira', 
        doctor: 'Dra. Ana', 
        specialty: 'Ortopedia', 
        status: 'Urgência', 
        doctorId: 'CRM-12345', 
        patientId: 'P-004', 
        patientGender: 'M', 
        patientAge: '32', 
        patientGuardian: '-', 
        problemDescription: 'Queda de moto. Dor intensa no joelho direito.', 
        procedureType: 'Raio-X de Emergência' 
    },
    { 
        id: 5, 
        date: '24/11', 
        time: '09:30', 
        patient: 'Arthur Costa', 
        doctor: 'Dr. Roberto', 
        specialty: 'Pediatria', 
        status: 'Realizado', 
        doctorId: 'CRM-98765', 
        patientId: 'P-005', 
        patientGender: 'M', 
        patientAge: '8', 
        patientGuardian: 'Fernanda Costa (Mãe)', 
        problemDescription: 'Febre alta há 2 dias e dor de garganta.', 
        procedureType: 'Consulta Pediátrica' 
    },
    { 
        id: 6, 
        date: '24/11', 
        time: '10:00', 
        patient: 'Maria Souza', 
        doctor: 'Dra. Ana', 
        specialty: 'Ginecologia', 
        status: 'Confirmado', 
        doctorId: 'CRM-12345', 
        patientId: 'P-006', 
        patientGender: 'F', 
        patientAge: '35', 
        patientGuardian: '-', 
        problemDescription: 'Retorno para avaliação de exames.', 
        procedureType: 'Retorno' 
    },
    { 
        id: 7, 
        date: '25/11', 
        time: '11:00', 
        patient: 'Carlos Lima', 
        doctor: 'Dr. Roberto', 
        specialty: 'Oftalmologia', 
        status: 'Agendado', 
        doctorId: 'CRM-98765', 
        patientId: 'P-007', 
        patientGender: 'M', 
        patientAge: '60', 
        patientGuardian: '-', 
        problemDescription: 'Dificuldade para ler de perto.', 
        procedureType: 'Exame de Vista' 
    },
    { 
        id: 8, 
        date: '26/11', 
        time: '16:30', 
        patient: 'Fernanda Rocha', 
        doctor: 'Dra. Ana', 
        specialty: 'Clínico Geral', 
        status: 'Cancelado', 
        doctorId: 'CRM-12345', 
        patientId: 'P-008', 
        patientGender: 'F', 
        patientAge: '24', 
        patientGuardian: '-', 
        problemDescription: 'Cancelado pelo paciente.', 
        procedureType: 'Consulta' 
    },
];

// --- Widget de Calendário ---
const CalendarWidget = () => {
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const emptyDays = Array(6).fill(null);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronLeft size={20} /></button>
                <h4 className="font-semibold text-gray-700">Novembro 2025</h4>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronRight size={20} /></button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-400 mb-2">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {[...emptyDays, ...daysInMonth].map((day, index) => {
                    const isSelected = day === 24;
                    if (!day) return <div key={index}></div>;
                    return (
                        <div key={index} className="flex justify-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full transition cursor-pointer ${isSelected ? 'bg-purple-600 text-white font-bold' : 'text-gray-700 hover:bg-purple-100'}`}>
                                {day}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function DashboardPage() {
    // Definindo activeTab
    const [activeTab, setActiveTab] = useState<'agendamentos' | 'historico'>('historico');

    const [appointments, setAppointments] = useState<AppointmentData[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const role = localStorage.getItem('userRole') || 'membro';
        setUserRole(role);
    }, []);

    const isReadOnly = userRole === 'recepcao';

    const handleOpenModal = (appointment: AppointmentData) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleNewAppointment = () => {
        if (isReadOnly) return;
        setSelectedAppointment(null); 
        setIsModalOpen(true);
    };

    const handleSaveAppointment = (updatedData: AppointmentData) => {
        if (updatedData.id === 0) {
            const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
            const newAppointment = { ...updatedData, id: newId };
            setAppointments(prev => [newAppointment, ...prev]);
        } else {
            setAppointments((prevList) =>
                prevList.map((item) => item.id === updatedData.id ? updatedData : item)
            );
        }
        setIsModalOpen(false);
    };

    const filteredAppointments = appointments.filter((item) => {
        const term = searchTerm.toLowerCase();
        const matchesPatient = item.patient.toLowerCase().includes(term);
        const matchesDoctor = item.doctor.toLowerCase().includes(term);
        return matchesPatient || matchesDoctor;
    });

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-base">
            
            <EditAppointmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointment={selectedAppointment}
                onSave={handleSaveAppointment}
                isReadOnly={isReadOnly}
            />

            {/* USANDO O COMPONENTE SIDEBAR AQUI */}
            <Sidebar active="agenda" />

            {/* CONTEÚDO PRINCIPAL com margem para a Sidebar */}
            <main className="flex-1 ml-72 p-8">
                <div className="max-w-8xl mx-auto">

                    <header className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Painel de Atendimento</h1>
                            <p className="text-gray-500 font-medium">Bem-vindo de volta.</p>
                        </div>
                        
                        {!isReadOnly && (
                            <button 
                                onClick={handleNewAppointment}
                                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                            >
                                <Plus size={20} />
                                Novo Agendamento
                            </button>
                        )}
                    </header>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="bg-white p-1 rounded-xl inline-flex shadow-sm border border-gray-100 whitespace-nowrap">
                            <button onClick={() => setActiveTab('agendamentos')} className={`px-6 py-2.5 rounded-lg font-medium transition ${activeTab === 'agendamentos' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Agendamentos (Hoje)</button>
                            <button onClick={() => setActiveTab('historico')} className={`px-6 py-2.5 rounded-lg font-medium transition ml-2 ${activeTab === 'historico' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Histórico Completo</button>
                        </div>

                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar paciente..."
                                className="w-full bg-white pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition shadow-sm"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-8 items-start">
                        <aside className="w-full xl:w-80 flex-shrink-0 order-2 xl:order-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Calendário</h3>
                            <CalendarWidget />
                        </aside>

                        <section className="flex-1 order-1 xl:order-2 w-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center">
                                <span>{searchTerm ? 'Resultados da busca' : 'Pacientes'} ({filteredAppointments.length})</span>
                                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Ordenado por: Horário</span>
                            </h3>

                            {filteredAppointments.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <Users size={32} />
                                    </div>
                                    <p className="text-gray-500 font-medium">Nenhum paciente encontrado.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {filteredAppointments.map(appointment => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        date={appointment.date}
                                        time={appointment.time}
                                        patient={appointment.patient}
                                        doctor={appointment.doctor}
                                        specialty={appointment.specialty}
                                        status={appointment.status}
                                        onViewDetails={() => handleOpenModal(appointment)}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
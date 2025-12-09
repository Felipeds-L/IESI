import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { AppointmentCard } from "../../components/AppointmentCard";
import {
  EditAppointmentModal,
  AppointmentData,
} from "../../components/EditAppointmentModal";
import { Sidebar } from "../../components/Sidebar";

// --- Função para Gerar Dados Dinâmicos Baseados no Dia Atual ---

// --- Componente Auxiliar: Calendário Funcional ---
interface CalendarWidgetProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const CalendarWidget = ({
  selectedDate,
  onDateSelect,
}: CalendarWidgetProps) => {
  const [viewDate, setViewDate] = useState(new Date());
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Lógica correta de dias do mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded text-gray-600 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <h4 className="font-semibold text-gray-700 capitalize">
          {months[month]} {year}
        </h4>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded text-gray-600 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-base font-medium text-gray-400 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-base">
        {[...emptyDays, ...daysArray].map((day, index) => {
          if (!day) return <div key={index}></div>;

          // Formata para DD/MM para comparar com os dados
          const formattedDay = `${String(day).padStart(2, "0")}/${String(
            month + 1
          ).padStart(2, "0")}`;
          const isSelected = formattedDay === selectedDate;

          return (
            <div key={index} className="flex justify-center">
              <div
                onClick={() => onDateSelect(formattedDay)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition cursor-pointer 
                                ${
                                  isSelected
                                    ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-200"
                                    : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                                }`}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Configuração da Paginação ---
const ITEMS_PER_PAGE = 6;

export default function DashboardPage() {
  // 1. Estados de Controle
  const [activeTab, setActiveTab] = useState<"agendamentos" | "historico">(
    "agendamentos"
  );

  // Inicializa a data com HOJE (formato DD/MM)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Inicializa appointments usando a função geradora
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string>("");

  // 2. Efeitos
  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await fetch("http://localhost:3000/agendamentos");
        if (!res.ok) throw new Error("Erro ao buscar agendamentos");

        const data = await res.json();

        // 🔥 Normalização dos dados vindos do backend
        const normalized = data.map((item: any) => ({
          id: item.id,
          date: item.dataHora?.split("T")[0] ?? "",
          time: item.dataHora?.split("T")[1]?.substring(0, 5) ?? "",
          patient: item.nomePaciente ?? "",
          doctor: item.funcionario?.crm ?? "", // aqui pode vir undefined
          specialty: item.especialidade ?? "",
          status: item.status ?? "",
          patientGender: item.sexo ?? "",
          patientAge: item.idade ? String(item.idade) : "",
          patientGuardian: item.responsavelNome ?? "",
          problemDescription: item.descricao ?? "",
          procedureType: item.tipoConsulta ?? "",
          doctorId: item.funcionarioId ? String(item.funcionarioId) : "",
        }));

        setAppointments(normalized);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar agendamentos");
      }
    }

    loadAppointments();
  }, []);

  // Atualiza status em tempo real (verifica a cada minuto)
  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments((prev) =>
        prev.map((app) => {
          if (
            app.date === selectedDate &&
            app.status !== "Realizado" &&
            app.status !== "Cancelado"
          ) {
            const now = new Date();
            const [h, m] = app.time.split(":").map(Number);
            const appTime = new Date();
            appTime.setHours(h, m, 0);

            if (appTime < now) return { ...app, status: "Pendente" };
          }
          return app;
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  // Resetar paginação ao mudar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, selectedDate]);

  const isReadOnly = userRole === "recepcao";

  // 3. Handlers de Ação

  const handleDeleteAppointment = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      setAppointments((prev) => prev.filter((app) => app.id !== id));
      toast.success("Agendamento excluído.");
    }
  };

  const handleConfirmAppointment = (id: number) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "Realizado" } : app))
    );
    toast.success("Atendimento confirmado com sucesso!");
  };

  const handleOpenModal = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleNewAppointment = () => {
    if (isReadOnly) return;
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (newAppointment: AppointmentData) => {
    try {
      // Monta dataHora (DD/MM + HH:mm → ISO)
      const [day, month] = newAppointment.date.split("/");
      const year = new Date().getFullYear(); // ou defina outro ano
      const dataHora = `${year}-${month}-${day}T${newAppointment.time}:00.000Z`;

      // Converte para o formato do backend
      const payload = {
        dataHora,
        status: newAppointment.status || "AGENDADO",
        tipoConsulta: newAppointment.procedureType,
        especialidade: newAppointment.specialty,
        descricao: newAppointment.problemDescription,
        sexo: newAppointment.patientGender,
        idade: Number(newAppointment.patientAge),
        responsavelNome: newAppointment.patientGuardian,
        nomePaciente: newAppointment.patient,
        funcionarioId: Number(newAppointment.doctorId),
      };

      const response = await fetch("http://localhost:3000/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("PAYLOAD ENVIADO:", payload);

      if (!response.ok) throw new Error("Erro ao criar agendamento");

      const created = await response.json();

      // 🔥 Normaliza o novo agendamento
      const normalizedCreated: AppointmentData = {
        id: created.id,
        date: created.dataHora?.split("T")[0] ?? "",
        time: created.dataHora?.split("T")[1]?.substring(0, 5) ?? "",
        patient: created.nomePaciente ?? "",
        doctor: created.funcionario?.crm ?? "",
        specialty: created.especialidade ?? "",
        status: created.status ?? "",
        patientGender: created.sexo ?? "",
        patientAge: created.idade ? String(created.idade) : "",
        patientGuardian: created.responsavelNome ?? "",
        problemDescription: created.descricao ?? "",
        procedureType: created.tipoConsulta ?? "",
        doctorId: created.funcionarioId ? String(created.funcionarioId) : "",
      };

      setAppointments((prev) => [normalizedCreated, ...prev]);
      toast.success("Agendamento criado!");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar agendamento");
    }
  };

  // 4. Filtragem e Paginação

  const getFilteredAppointments = () => {
    let filtered = appointments.filter((item) => {
      const term = searchTerm.toLowerCase();
      return (
        item.patient.toLowerCase().includes(term) ||
        item.doctor.toLowerCase().includes(term)
      );
    });

    if (activeTab === "agendamentos") {
      filtered = filtered.filter((item) => {
        const [, month, day] = item.date.split("-");
        const formattedDate = `${day}/${month}`;
        return formattedDate === selectedDate;
      });
    }

    return filtered;
  };

  const filteredList = getFilteredAppointments();
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredList.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  function handleDateClick(date: string) {
    setSelectedDate(date); // atualiza o dia selecionado
    setCurrentPage(1); // opcional: resetar paginação
  }
  function handlePageChange(page: number) {
    if (page < 1) return;
    if (page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-base">
      <EditAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
        isReadOnly={isReadOnly}
      />

      <Sidebar active="agenda" />

      <main className="flex-1 ml-72 p-8">
        <div className="max-w-8xl mx-auto">
          <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                Painel de Atendimento
              </h1>
              <p className="text-gray-500 font-medium">
                Data Selecionada: {selectedDate}
              </p>
            </div>
            {!isReadOnly && (
              <button
                onClick={handleNewAppointment}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200"
              >
                <Plus size={20} /> Novo Agendamento
              </button>
            )}
          </header>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="bg-white p-1 rounded-xl inline-flex shadow-sm border border-gray-100 whitespace-nowrap">
              <button
                onClick={() => setActiveTab("agendamentos")}
                className={`px-6 py-2.5 rounded-lg font-medium transition ${
                  activeTab === "agendamentos"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Agendamentos ({selectedDate})
              </button>
              <button
                onClick={() => setActiveTab("historico")}
                className={`px-6 py-2.5 rounded-lg font-medium transition ml-2 ${
                  activeTab === "historico"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Histórico Completo
              </button>
            </div>
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente..."
                className="w-full bg-white pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* CALENDÁRIO */}
            <aside className="w-full xl:w-80 flex-shrink-0 order-2 xl:order-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Calendário
              </h3>
              <CalendarWidget
                selectedDate={selectedDate}
                onDateSelect={handleDateClick}
              />
            </aside>

            {/* LISTA DE CARDS */}
            <section className="flex-1 order-1 xl:order-2 w-full">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center">
                <span>
                  {searchTerm
                    ? "Resultados"
                    : activeTab === "historico"
                    ? "Todos os Agendamentos"
                    : `Agendamentos de ${selectedDate}`}{" "}
                  <span className="ml-2 text-gray-400 text-base font-normal">
                    ({filteredList.length} total)
                  </span>
                </span>
                <span className="text-base font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Página {currentPage} de {totalPages || 1}
                </span>
              </h3>

              {paginatedList.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Users size={32} />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Nenhum agendamento encontrado.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {paginatedList.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    date={appointment.date}
                    time={appointment.time}
                    patient={appointment.patient}
                    doctor={appointment.doctor}
                    specialty={appointment.specialty}
                    status={appointment.status}
                    onViewDetails={() => handleOpenModal(appointment)}
                    onDelete={handleDeleteAppointment}
                    onConfirm={handleConfirmAppointment}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:text-purple-600 disabled:opacity-50 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          currentPage === page
                            ? "bg-purple-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-white border border-transparent hover:border-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:text-purple-600 disabled:opacity-50 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

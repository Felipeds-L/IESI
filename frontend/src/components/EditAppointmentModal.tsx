import { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  Stethoscope,
  Clock,
  Calendar,
  Hash,
  Users,
  Activity,
  Syringe,
  Search,
} from "lucide-react";

export interface AppointmentData {
  id: number;
  date: string;
  time: string;
  patient: string;
  doctor: string;
  specialty: string;
  status: string;
  doctorId?: string;
  patientId?: string;
  patientGender?: string;
  patientAge?: string;
  patientGuardian?: string;
  problemDescription?: string;
  procedureType?: string;
}

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentData | null;
  onSave: (updatedData: AppointmentData) => void;
  isReadOnly?: boolean;
}

const API_URL = "http://localhost:3000";

interface Paciente {
  id: number;
  nome: string;
  paciente?: {
    cpf: string;
    dataNascimento?: string;
    sexo?: string;
    responsavelNome?: string;
  };
}

export function EditAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSave,
  isReadOnly = false,
}: EditAppointmentModalProps) {
  const [formData, setFormData] = useState<AppointmentData | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        setFormData(appointment);
      } else {
        setFormData({
          id: 0,
          date: "",
          time: "",
          patient: "",
          doctor: "",
          specialty: "",
          status: "Agendado",
          doctorId: "",
          patientId: "",
          patientGender: "",
          patientAge: "",
          patientGuardian: "",
          problemDescription: "",
          procedureType: "",
        });
      }
      loadPacientes();
      loadMedicos();
      
      // Preenche ID do médico automaticamente se for médico logado
      const funcionarioId = localStorage.getItem("funcionarioId");
      const userRole = localStorage.getItem("userRole");
      if (userRole === "medico" && funcionarioId && !appointment) {
        setFormData((prev) => prev ? { ...prev, doctorId: funcionarioId } : null);
      }
    }
  }, [appointment, isOpen]);

  const loadPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/pacientes`);
      if (response.ok) {
        const data = await response.json();
        setPacientes(data);
      }
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  const loadMedicos = async () => {
    try {
      const response = await fetch(`${API_URL}/medicos`);
      if (response.ok) {
        const data = await response.json();
        setMedicos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
    }
  };

  const handleSelectPatient = (paciente: Paciente) => {
    if (!formData || isReadOnly) {
      console.log("[AGENDAMENTO] Não pode selecionar - formData:", formData, "isReadOnly:", isReadOnly);
      return;
    }

    console.log("[AGENDAMENTO] Paciente selecionado:", paciente);
    console.log("[AGENDAMENTO] formData atual antes da atualização:", formData);

    const idade = paciente.paciente?.dataNascimento
      ? (() => {
          const hoje = new Date();
          const nascimento = new Date(paciente.paciente.dataNascimento);
          const idade = hoje.getFullYear() - nascimento.getFullYear();
          const mes = hoje.getMonth() - nascimento.getMonth();
          return mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())
            ? idade - 1
            : idade;
        })()
      : "";

    const updatedData: AppointmentData = {
      ...formData,
      patient: paciente.nome,
      patientId: String(paciente.id),
      patientGender: paciente.paciente?.sexo || "",
      patientAge: idade ? String(idade) : "",
      // Removido patientGuardian - não será mais usado no formulário
    };

    console.log("[AGENDAMENTO] Dados atualizados:", updatedData);
    console.log("[AGENDAMENTO] Nome do paciente que será setado:", updatedData.patient);
    
    // Atualiza o estado de forma explícita
    setFormData((prev) => {
      if (!prev) return null;
      const newData = {
        ...prev,
        patient: paciente.nome,
        patientId: String(paciente.id),
        patientGender: paciente.paciente?.sexo || "",
        patientAge: idade ? String(idade) : "",
      };
      console.log("[AGENDAMENTO] Novo estado dentro do setFormData:", newData);
      return newData;
    });
    
    setShowPatientSearch(false);
    setSearchTerm("");
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Não fecha se clicar dentro do container de busca ou no dropdown
      if (!target.closest('.patient-search-container')) {
        setShowPatientSearch(false);
      }
    };

    if (showPatientSearch) {
      // Adiciona um pequeno delay para não fechar imediatamente ao clicar no campo
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPatientSearch]);

  const filteredPacientes = searchTerm.trim() === ""
    ? pacientes // Se não há texto, mostra todos
    : pacientes.filter(
        (paciente) =>
          paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paciente.paciente?.cpf.includes(searchTerm.replace(/\D/g, ""))
      );

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof AppointmentData, value: string) => {
    // Se for apenas leitura, bloqueamos a edição
    if (isReadOnly) return;
    
    // Formatação de data (DD/MM)
    if (field === "date") {
      // Remove tudo que não é número
      let digits = value.replace(/\D/g, "");
      // Limita a 4 dígitos (DDMM)
      if (digits.length > 4) digits = digits.slice(0, 4);
      // Formata DD/MM
      if (digits.length >= 2) {
        value = digits.slice(0, 2) + "/" + digits.slice(2);
      } else {
        value = digits;
      }
    }
    
    // Formatação de hora (HH:MM)
    if (field === "time") {
      // Remove tudo que não é número
      let digits = value.replace(/\D/g, "");
      // Limita a 4 dígitos (HHMM)
      if (digits.length > 4) digits = digits.slice(0, 4);
      // Formata HH:MM
      if (digits.length >= 2) {
        value = digits.slice(0, 2) + ":" + digits.slice(2);
      } else {
        value = digits;
      }
    }
    
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && !isReadOnly) {
      onSave(formData);
      onClose();
    }
  };

  const isEditing = formData.id !== 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Cabeçalho adapta a cor se for apenas leitura */}
        <div
          className={`${
            isReadOnly ? "bg-gray-600" : "bg-purple-600"
          } p-6 flex justify-between items-center text-white sticky top-0 z-10`}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isReadOnly
              ? "👁️ Prontuário (Visualização)"
              : isEditing
              ? "✏️ Editar Prontuário"
              : "➕ Novo Agendamento"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Dados do Agendamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Data
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  maxLength={5}
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="DD/MM"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                  <Clock size={12} /> Hora
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  maxLength={5}
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="HH:MM"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                  Status
                </label>
                <select
                  disabled={isReadOnly}
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none bg-white text-sm disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="Agendado">Agendado</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Realizado">Realizado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Urgência">Urgência</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User size={16} /> Dados do Paciente
            </h3>
            
            {/* Busca de Paciente */}
            {!isReadOnly && (
              <div className="mb-4 relative patient-search-container">
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                  Buscar Paciente Cadastrado
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowPatientSearch(true);
                    }}
                    onFocus={() => {
                      console.log("[AGENDAMENTO] Campo de busca focado");
                      setShowPatientSearch(true);
                    }}
                    onClick={() => {
                      console.log("[AGENDAMENTO] Campo de busca clicado");
                      setShowPatientSearch(true);
                    }}
                    className="w-full border rounded-lg p-2 pl-9 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    placeholder="Digite o nome ou CPF do paciente..."
                  />
                  {showPatientSearch && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPacientes.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          {searchTerm ? "Nenhum paciente encontrado" : "Digite para buscar ou selecione abaixo"}
                        </div>
                      ) : (
                        <>
                          {!searchTerm && (
                            <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                              {filteredPacientes.length} paciente(s) cadastrado(s)
                            </div>
                          )}
                          {filteredPacientes.map((paciente) => (
                            <button
                              key={paciente.id}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("[AGENDAMENTO] Botão clicado para paciente:", paciente);
                                handleSelectPatient(paciente);
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                              className="w-full text-left p-3 hover:bg-purple-50 border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
                            >
                              <div className="font-medium text-gray-900">
                                {paciente.nome}
                              </div>
                              <div className="text-xs text-gray-500">
                                CPF: {paciente.paciente?.cpf || "-"}
                              </div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                  ID Paciente
                </label>
                <div className="relative">
                  <Hash
                    size={12}
                    className="absolute left-2 top-3 text-gray-400"
                  />
                  <input
                    disabled={isReadOnly}
                    className="w-full border rounded-lg p-2 pl-6 bg-gray-50 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    value={formData.patientId || ""}
                    onChange={(e) => handleChange("patientId", e.target.value)}
                    placeholder="000"
                  />
                </div>
              </div>

              <div className="md:col-span-6">
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                  Nome Completo
                </label>
                <input
                  disabled={isReadOnly}
                  readOnly
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none font-medium bg-gray-50 text-gray-700 cursor-not-allowed"
                  value={formData?.patient || ""}
                  placeholder="Selecione um paciente acima"
                />
                {formData?.patient && (
                  <p className="text-xs text-green-600 mt-1">✓ Paciente selecionado</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                  Idade
                </label>
                <input
                  disabled={isReadOnly}
                  type="text"
                  className="w-full border rounded-lg p-2 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  value={formData.patientAge || ""}
                  onChange={(e) => handleChange("patientAge", e.target.value)}
                  placeholder="Anos"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                  Gênero
                </label>
                <select
                  disabled={isReadOnly}
                  className="w-full border rounded-lg p-2 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  value={formData.patientGender || ""}
                  onChange={(e) =>
                    handleChange("patientGender", e.target.value)
                  }
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Stethoscope size={16} /> Dados Clínicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                  Médico
                </label>
                <select
                  disabled={isReadOnly}
                  className="w-full border rounded-lg p-2 bg-white text-sm disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.doctorId || ""}
                  onChange={(e) => {
                    handleChange("doctorId", e.target.value);
                    // Preenche especialidade automaticamente ao selecionar médico
                    if (e.target.value) {
                      const medicoSelecionado = medicos.find(m => String(m.id) === e.target.value);
                      if (medicoSelecionado && medicoSelecionado.especialidade) {
                        handleChange("specialty", medicoSelecionado.especialidade);
                      }
                    }
                  }}
                >
                  <option value="">Selecione um médico</option>
                  {medicos.map((medico) => (
                    <option key={medico.id} value={String(medico.id)}>
                      {medico.nome} - CRM: {medico.crm || "N/A"} {medico.especialidade ? `(${medico.especialidade})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                  <Syringe size={12} /> Tipo de Procedimento
                </label>
                <input
                  disabled={isReadOnly}
                  type="text"
                  value={formData.procedureType || ""}
                  onChange={(e) =>
                    handleChange("procedureType", e.target.value)
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Ex: Consulta, Cirurgia, Exame..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <Activity size={12} /> Descrição do Problema / Queixa Principal
              </label>
              <textarea
                disabled={isReadOnly}
                className="w-full border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-purple-500 outline-none resize-none disabled:bg-gray-100 disabled:text-gray-500"
                value={formData.problemDescription || ""}
                onChange={(e) =>
                  handleChange("problemDescription", e.target.value)
                }
                placeholder="Descreva os sintomas, histórico ou motivo da consulta..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {isReadOnly ? "Fechar" : "Cancelar"}
            </button>

            {/* Escondemos o botão de salvar se for Apenas Leitura */}
            {!isReadOnly && (
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-md"
              >
                <Save size={18} />{" "}
                {isEditing ? "Salvar Alterações" : "Criar Agendamento"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { toast } from "sonner";
import { Plus, Search, User, FileText, Calendar, X, Users } from "lucide-react";
import { z } from "zod";

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

const pacienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  dataNascimento: z.string().optional().or(z.literal("")),
  sexo: z.enum(["M", "F", "Outro", ""]).optional().or(z.literal("")),
  responsavelNome: z.string().optional().or(z.literal("")),
});

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "" as "M" | "F" | "Outro" | "",
    responsavelNome: "",
  });

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/pacientes`);
      if (!response.ok) throw new Error("Erro ao carregar pacientes");
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar pacientes");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "cpf") {
      // Formata CPF
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("[PACIENTE] Iniciando criação de paciente...");
    console.log("[PACIENTE] FormData:", formData);

    try {
      console.log("[PACIENTE] Validando dados com schema...");
      const result = pacienteSchema.safeParse(formData);
      if (!result.success) {
        console.error("[PACIENTE] Erro de validação:", result.error);
        toast.error(result.error.issues[0].message);
        setLoading(false);
        return;
      }
      console.log("[PACIENTE] Validação OK");

      const cpfLimpo = formData.cpf.replace(/[^\d]+/g, "");
      const payload: any = {
        nome: formData.nome.trim(),
        cpf: cpfLimpo,
      };

      // Adiciona campos opcionais apenas se preenchidos
      if (formData.dataNascimento && formData.dataNascimento.trim() !== "") {
        payload.dataNascimento = formData.dataNascimento;
      }
      if (formData.sexo && formData.sexo !== "" && formData.sexo !== "Selecione") {
        payload.sexo = formData.sexo;
      }
      if (formData.responsavelNome && formData.responsavelNome.trim() !== "") {
        payload.responsavelNome = formData.responsavelNome.trim();
      }

      console.log("[PACIENTE] Payload preparado:", payload);
      console.log("[PACIENTE] Enviando requisição para:", `${API_URL}/pacientes`);

      const response = await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("[PACIENTE] Resposta recebida:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }));
        console.error("[PACIENTE] Erro na resposta:", errorData);
        throw new Error(errorData.error || "Erro ao criar paciente");
      }

      const responseData = await response.json();
      console.log("[PACIENTE] Paciente criado com sucesso:", responseData);

      toast.success("Paciente cadastrado com sucesso!");
      setIsModalOpen(false);
      setFormData({
        nome: "",
        cpf: "",
        dataNascimento: "",
        sexo: "",
        responsavelNome: "",
      });
      console.log("[PACIENTE] Recarregando lista de pacientes...");
      await loadPacientes();
      console.log("[PACIENTE] Processo concluído!");
    } catch (error: any) {
      console.error("[PACIENTE] Erro capturado:", error);
      // Extrai mensagem de erro mais amigável
      let errorMessage = error.message;
      if (errorMessage.includes("CPF já cadastrado")) {
        errorMessage = "CPF já cadastrado no sistema";
      } else if (errorMessage.includes("CPF deve conter")) {
        errorMessage = "CPF inválido. Deve conter 11 dígitos";
      } else if (errorMessage.includes("nome deve ter")) {
        errorMessage = "Nome deve ter no mínimo 3 caracteres";
      }
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      console.log("[PACIENTE] Finalizando (setLoading false)");
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.paciente?.cpf.includes(searchTerm)
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="pacientes" />
      <main className="flex-1 ml-72 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header simples */}
          <div className="bg-blue-700 rounded-lg shadow p-6 mb-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Prontuário de Pacientes
                </h1>
                <p className="text-blue-200">
                  {pacientes.length} {pacientes.length === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-blue-700 px-5 py-2 rounded font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Novo Paciente
              </button>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="bg-white rounded border border-gray-300 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Data de Nascimento
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Sexo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Responsável
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPacientes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-full">
                            <User size={48} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-700 mb-1">Nenhum paciente encontrado</p>
                            <p className="text-sm text-gray-500">Tente ajustar sua busca ou cadastre um novo paciente</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPacientes.map((paciente, index) => (
                      <tr 
                        key={paciente.id} 
                        className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {paciente.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {paciente.nome}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block">
                            {paciente.paciente?.cpf || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} className="text-indigo-400" />
                            {formatDate(paciente.paciente?.dataNascimento)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            paciente.paciente?.sexo === 'M' 
                              ? 'bg-blue-100 text-blue-700' 
                              : paciente.paciente?.sexo === 'F'
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {paciente.paciente?.sexo || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {paciente.paciente?.responsavelNome || (
                              <span className="text-gray-400 italic">Não informado</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="bg-purple-600 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus size={24} />
                Novo Paciente
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-purple-700 rounded-lg p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Nome completo do paciente"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) =>
                      handleInputChange("dataNascimento", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Sexo
                  </label>
                  <select
                    value={formData.sexo}
                    onChange={(e) =>
                      handleInputChange("sexo", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome do Responsável <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={formData.responsavelNome}
                  onChange={(e) =>
                    handleInputChange("responsavelNome", e.target.value)
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Nome do pai, mãe ou responsável legal"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Cadastrar Paciente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


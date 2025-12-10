import { useState, useEffect } from 'react';
import { Plus, X, Search, Stethoscope, User, Edit2, Trash2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../../components/Sidebar';

const API_URL = "http://localhost:3000";

interface Medico {
  id: number;
  pessoaId: number;
  nome: string;
  cpf: string;
  crm: string;
  cargo: string;
  especialidade?: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    crm: "",
    password: "",
    especialidade: "",
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'administrativo' && role !== 'admin') {
      toast.error("Acesso negado. Área restrita a administradores.");
      navigate('/dashboard');
      return;
    }
    loadMedicos();
  }, [navigate]);

  const loadMedicos = async () => {
    try {
      const response = await fetch(`${API_URL}/medicos`);
      if (!response.ok) throw new Error("Erro ao carregar médicos");
      const data = await response.json();
      setMedicos(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar médicos");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "cpf") {
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

    try {
      const cpfLimpo = formData.cpf.replace(/[^\d]+/g, "");
      
      if (editingMedico) {
        // Atualizar
        const payload: any = {
          nome: formData.nome,
          cpf: cpfLimpo,
          crm: formData.crm,
          especialidade: formData.especialidade || null,
        };
        if (formData.password) {
          payload.password = formData.password;
        }

        const response = await fetch(`${API_URL}/medicos/${editingMedico.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao atualizar médico");
        }

        toast.success("Médico atualizado com sucesso!");
      } else {
        // Criar
        if (!formData.password) {
          toast.error("Senha é obrigatória");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/medicos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: formData.nome.trim(),
            cpf: cpfLimpo,
            crm: formData.crm.trim(),
            password: formData.password,
            especialidade: formData.especialidade.trim() || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao criar médico");
        }

        toast.success("Médico cadastrado com sucesso!");
      }

      setIsModalOpen(false);
      setEditingMedico(null);
      setFormData({
        nome: "",
        cpf: "",
        crm: "",
        password: "",
        especialidade: "",
      });
      loadMedicos();
    } catch (error: any) {
      // Mensagens de erro mais amigáveis
      let errorMessage = error.message;
      if (errorMessage.includes("CPF já cadastrado")) {
        errorMessage = "CPF já cadastrado para outro médico";
      } else if (errorMessage.includes("CPF inválido")) {
        errorMessage = "CPF inválido. Deve conter 11 dígitos";
      }
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medico: Medico) => {
    setEditingMedico(medico);
    setFormData({
      nome: medico.nome,
      cpf: medico.cpf,
      crm: medico.crm || "",
      password: "",
      especialidade: medico.especialidade || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este médico?")) return;

    try {
      const response = await fetch(`${API_URL}/medicos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir médico");
      }

      toast.success("Médico excluído com sucesso!");
      loadMedicos();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredMedicos = medicos.filter((medico) =>
    medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.crm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.especialidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.cpf.includes(searchTerm.replace(/\D/g, ""))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="admin" />
      <main className="flex-1 ml-72 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header simples */}
          <div className="bg-green-700 rounded-lg shadow p-6 mb-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Administração
                </h1>
                <p className="text-green-200">
                  {medicos.length} {medicos.length === 1 ? 'médico cadastrado' : 'médicos cadastrados'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingMedico(null);
                  setFormData({
                    nome: "",
                    cpf: "",
                    crm: "",
                    password: "",
                    especialidade: "",
                  });
                  setIsModalOpen(true);
                }}
                className="bg-white text-green-700 px-5 py-2 rounded font-semibold hover:bg-green-50 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Novo Médico
              </button>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="bg-white rounded border border-gray-300 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      CRM
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Especialidade
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-emerald-100">
                  {filteredMedicos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-gray-200 p-6 rounded-full">
                            <Stethoscope size={48} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-700 mb-1">Nenhum médico encontrado</p>
                            <p className="text-sm text-gray-500">Cadastre o primeiro médico do sistema</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMedicos.map((medico, index) => (
                      <tr 
                        key={medico.id} 
                        className={`hover:bg-gray-50 transition-all ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                              {medico.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {medico.nome}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-mono bg-emerald-100 px-3 py-1 rounded-lg inline-block border border-emerald-200">
                            {medico.cpf}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg inline-block border border-teal-200">
                            {medico.crm || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {medico.especialidade ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 border border-cyan-200">
                              {medico.especialidade}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(medico)}
                              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 hover:border-emerald-300"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(medico.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
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

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl">
            <div className="bg-green-700 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus size={24} />
                {editingMedico ? "Editar Médico" : "Novo Médico"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMedico(null);
                }}
                className="hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Informações Pessoais
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className="w-full border-2 border-emerald-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Nome completo do médico"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    CRM *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.crm}
                    onChange={(e) => handleInputChange("crm", e.target.value)}
                    className="w-full border-2 border-emerald-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: CRM12345"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Especialidade
                  </label>
                  <input
                    type="text"
                    value={formData.especialidade}
                    onChange={(e) => handleInputChange("especialidade", e.target.value)}
                    className="w-full border-2 border-emerald-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: Cardiologista, Pediatra, Clínico Geral..."
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                </div>
              </div>

              {/* Dados de Login */}
              <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-300">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wide border-b border-emerald-300 pb-2">
                  Dados de Login
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full border-2 border-emerald-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="000.000.000-00"
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Senha {editingMedico ? "(deixe em branco para não alterar)" : "*"}
                    </label>
                    <input
                      type="password"
                      required={!editingMedico}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full border-2 border-emerald-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Senha de acesso"
                      autoComplete={editingMedico ? "new-password" : "new-password"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMedico(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors disabled:opacity-50 font-semibold"
                >
                  {loading ? "Salvando..." : editingMedico ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

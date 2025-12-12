import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, User, Loader2, FileText, Stethoscope } from "lucide-react";
import { z } from "zod";

import heroImage from "../../assets/hospital-hero.jpg";

// URL da API
const API_URL = "http://localhost:3000";

const loginSchema = z.object({
  cpf: z.string().min(1, "CPF ou login é obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
});


const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab] = useState<"login" | "signup">("login");

  const [loginData, setLoginData] = useState({ cpf: "", password: "" });

  // --- FUNÇÕES DE API ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!loginData.cpf || !loginData.password) {
        toast.error("Preencha todos os campos");
        setLoading(false);
        return;
      }

      // Se não for admin, remove formatação do CPF
      const loginValue = loginData.cpf.toLowerCase() === 'admin' 
        ? 'admin' 
        : loginData.cpf.replace(/[^\d]+/g, "");
      
      console.log("Tentando login com:", { cpf: loginValue, password: "***" });
      
      // Chama a API de autenticação
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: loginValue,
          password: loginData.password,
        }),
      });

      console.log("Resposta da API:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro ao processar resposta" }));
        console.error("Erro na resposta:", errorData);
        throw new Error(errorData.error || "Credenciais inválidas. Verifique CPF ou senha.");
      }

      const data = await response.json();
      console.log("Login bem-sucedido:", data);
      
      // Salva token e dados do usuário no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.pessoa.funcionario?.cargo?.toLowerCase() || "medico");
      localStorage.setItem("userName", data.pessoa.nome);
      localStorage.setItem("userId", String(data.pessoa.id));
      
      // Se for médico, salva o ID do funcionário também
      if (data.pessoa.funcionario?.cargo === "MEDICO" && data.pessoa.id !== 0) {
        // Busca o ID do funcionário
        const funcionarioResponse = await fetch(`${API_URL}/medicos`);
        if (funcionarioResponse.ok) {
          const medicos = await funcionarioResponse.json();
          const medico = medicos.find((m: any) => m.pessoaId === data.pessoa.id);
          if (medico) {
            localStorage.setItem("funcionarioId", String(medico.id));
          }
        }
      }

      const roleLabel = data.pessoa.funcionario?.cargo === "MEDICO" ? "Médico(a)" :
                       data.pessoa.funcionario?.cargo === "ENFERMEIRO" ? "Enfermeiro(a)" :
                       data.pessoa.funcionario?.cargo === "ADMINISTRATIVO" ? "Administrador" : "Usuário";

      toast.success(`Bem-vindo, ${data.pessoa.nome}! Acesso: ${roleLabel}`);
      
      // Redireciona baseado no cargo
      const roleLower = data.pessoa.funcionario?.cargo?.toLowerCase();
      if (roleLower === 'administrativo' || roleLower === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };


  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      toast.error(error.issues[0].message, { duration: 4000 });
    } else if (error instanceof Error) {
      let errorMessage = error.message;
      if (errorMessage.includes("CPF ou senha incorretos") || errorMessage.includes("Credenciais inválidas")) {
        errorMessage = "CPF ou senha incorretos";
      }
      toast.error(errorMessage, { duration: 4000 });
    } else {
      toast.error("Erro inesperado", { duration: 4000 });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let value = e.target.value;
    if (field === 'cpf') {
      // Se começar com letra ou for "admin", permite texto (login)
      if (/^[a-zA-Z]/.test(value) || value.toLowerCase().startsWith('admin')) {
        // Permite letras e números para login
        value = value;
      } else {
        // Se for apenas números, formata como CPF
        value = value.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
      }
    }

    setLoginData({ ...loginData, [field as keyof typeof loginData]: value });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 font-sans">
      
      {/* Lado Esquerdo - Hero */}
      <div className="hidden md:flex items-center justify-center p-12 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Imagem de Fundo"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/80 to-transparent"></div>

        <div className="relative z-10 text-white space-y-6 max-w-md">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30 p-4">
            <img 
              src="/asset/imagem_2025-12-12_144309060-removebg-preview.png" 
              alt="HeathLink Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold leading-tight tracking-tight">
            HeathLink
          </h1>
          <p className="text-xl text-purple-100 leading-relaxed font-light">
            Sistema Integrado de Gestão de Saúde e Prontuários Eletrônicos.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulários */}
      <div className="flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Bem-vindo de volta
            </h2>
            <p className="text-base text-gray-500">
              Acesse o painel com suas credenciais
            </p>
          </div>

          {/* FORMULÁRIO LOGIN */}
          <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">CPF ou Login</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="CPF ou login (ex: admin)"
                    className="w-full h-12 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={loginData.cpf}
                    onChange={(e) => handleInputChange(e, "cpf")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-12 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={loginData.password}
                    onChange={(e) => handleInputChange(e, "password")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center rounded-lg bg-purple-600 text-white text-base font-bold hover:bg-purple-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Acessar Sistema"}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
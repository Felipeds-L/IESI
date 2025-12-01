import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, User, Loader2, FileText, Stethoscope } from "lucide-react";
import { z } from "zod";

import heroImage from "../../assets/hospital-hero.jpg";

// --- DADOS DE TESTE (MOCK) ---

const TEST_ACCOUNTS = [
  { role: "admin", cpf: "000.000.000-00", pass: "admin123", route: "/dashboard", label: "Administrador" },
  { role: "medico", cpf: "111.111.111-11", pass: "med123", route: "/dashboard", label: "Médico(a)" },
  { role: "enfermeiro", cpf: "222.222.222-22", pass: "enf123", route: "/dashboard", label: "Enfermeiro(a)" },
  { role: "recepcao", cpf: "333.333.333-33", pass: "rec123", route: "/dashboard", label: "Recepção" },
];

const loginSchema = z.object({
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  password: z.string().min(1, "Senha obrigatória"),
});

const signUpSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["medico", "enfermeiro", "recepcao", "admin"]),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const [loginData, setLoginData] = useState({ cpf: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    cpf: "",
    password: "",
    role: "medico",
  });

  // --- FUNÇÕES DE API ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usando safeParse para validação segura
      const result = loginSchema.safeParse(loginData);
      
      if (!result.success) {
        handleError(result.error);
        setLoading(false);
        return;
      }

      const validated = result.data;
      
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // --- LÓGICA DE MÚLTIPLOS ACESSOS (MOCK) ---
      const mockUser = TEST_ACCOUNTS.find(
        u => u.cpf === validated.cpf && u.pass === validated.password
      );

      if (mockUser) {
          // Aqui salvamos o "Crachá" do usuário
          localStorage.setItem("userRole", mockUser.role);
          localStorage.setItem("userName", "Usuário de Teste");

          toast.success(`Bem-vindo! Acesso: ${mockUser.label}`);
          
          // Redireciona para a rota definida (agora todos vão para /dashboard)
          navigate(mockUser.route);
          return;
      }

      throw new Error("Credenciais inválidas. Verifique CPF ou senha.");

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = signUpSchema.safeParse(signupData);

      if (!result.success) {
        handleError(result.error);
        setLoading(false);
        return;
      }
      
      // Simulação de cadastro
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Conta criada! Faça login para continuar.");
      setActiveTab("login");
      setLoginData({ cpf: signupData.cpf, password: "" });
      
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      toast.error(error.issues[0].message);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Erro inesperado");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    form: "login" | "signup",
    field: string
  ) => {
    let value = e.target.value;
    if (field === 'cpf') {
        value = value.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    if (form === "login") {
      setLoginData({ ...loginData, [field as keyof typeof loginData]: value });
    } else {
      setSignupData({ ...signupData, [field as keyof typeof signupData]: value });
    }
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
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Hospital Oliveira de Menezes
          </h1>
          <p className="text-xl text-purple-100 leading-relaxed font-light">
            Sistema Integrado de Gestão Hospitalar e Prontuários.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulários */}
      <div className="flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

          {/* Abas */}
          <div className="flex p-1 bg-purple-50 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2.5 text-base font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-purple-400 hover:text-purple-600"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2.5 text-base font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-purple-400 hover:text-purple-600"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {activeTab === "login" ? "Bem-vindo de volta" : "Criar nova conta"}
            </h2>
            <p className="text-base text-gray-500">
              {activeTab === "login" 
                ? "Acesse o painel com suas credenciais" 
                : "Preencha os dados para solicitar acesso"}
            </p>
          </div>

          {/* FORMULÁRIO LOGIN */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">CPF</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    className="w-full h-12 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={loginData.cpf}
                    onChange={(e) => handleInputChange(e, "login", "cpf")}
                    maxLength={14}
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
                    onChange={(e) => handleInputChange(e, "login", "password")}
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
          )}

          {/* FORMULÁRIO CADASTRO */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    className="w-full h-12 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={signupData.fullName}
                    onChange={(e) => handleInputChange(e, "signup", "fullName")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">CPF</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    className="w-full h-12 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={signupData.cpf}
                    onChange={(e) => handleInputChange(e, "signup", "cpf")}
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    className="w-full h-12 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    value={signupData.password}
                    onChange={(e) => handleInputChange(e, "signup", "password")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700 ml-1">Perfil de Acesso</label>
                <select
                  className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none cursor-pointer"
                  value={signupData.role}
                  onChange={(e) => handleInputChange(e, "signup", "role")}
                >
                  <option value="medico">Médico(a)</option>
                  <option value="enfermeiro">Enfermeiro(a)</option>
                  <option value="recepcao">Recepção</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center rounded-lg bg-purple-600 text-white text-base font-bold hover:bg-purple-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Criar Conta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
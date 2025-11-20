import { useState } from 'react';

// 1. TypeScript: Definindo a "forma" que um objeto de usuário deve ter
interface UserProfile {
  name: string;
  role: 'Desenvolvedor' | 'Designer' | 'Gestor'; // Só aceita esses 3 valores
  xpLevel: number;
}

function App() {
  // 2. TypeScript: O Generics <number> garante que 'count' nunca será uma string
  const [count, setCount] = useState<number>(0);

  // Objeto que segue a interface definida acima
  const user: UserProfile = {
    name: "Leonardo",
    role: "Desenvolvedor", // Se escrever "Padeiro" aqui, o VS Code vai gritar!
    xpLevel: 10
  };

  // 3. TypeScript: Função com argumentos tipados e retorno 'void' (vazio)
  const handleIncrement = (amount: number): void => {
    setCount((prev) => prev + amount);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 text-center">
        
        {/* Badge do Cargo */}
        <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {user.role}
        </span>

        <h1 className="text-3xl font-bold text-white mt-4 mb-2">
          Olá, {user.name}!
        </h1>

        <p className="text-slate-400 mb-8">
          Teste de TS + Tailwind. Seu nível de XP é:
        </p>

        {/* Contador Gigante */}
        <div className="text-6xl font-black text-white mb-8 transition-all hover:text-indigo-400 cursor-default">
          {count}
        </div>

        <div className="flex gap-4 justify-center">
          {/* Botão Decrementar */}
          <button 
            onClick={() => handleIncrement(-1)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-3 px-6 rounded-lg transition duration-200 border border-red-500/50"
          >
            -1 XP
          </button>

          {/* Botão Incrementar */}
          <button 
            onClick={() => handleIncrement(1)} // Se passar "1" (string), o TS vai marcar erro aqui
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold py-3 px-6 rounded-lg transition duration-200 border border-emerald-500/50"
          >
            +1 XP
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-600">
          Edite o arquivo <code>App.tsx</code> para ver o Hot Reload.
        </p>
      </div>
    </div>
  );
}

export default App;
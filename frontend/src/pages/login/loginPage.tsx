



//Código de teste






import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Evita recarregar a página
    
    // Simula um login básico
    if (email && password) {
      console.log("Login feito com:", email);
      navigate('/dashboard'); // Redireciona para a dashboard
    } else {
      alert("Preencha os campos!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm border border-gray-700">
        
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Acesso ao Sistema
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
              placeholder="admin@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
              placeholder="******"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded mt-4 transition-colors"
          >
            Entrar
          </button>

        </form>
      </div>
    </div>
  );
}
import { Router } from 'express';
import { userRoutes } from './user.routes'; // Importa as rotas de usuário
console.log('--- [DEBUG] CARREGANDO: routes/index.ts ---');
const routes = Router();

// Rota "raiz" para testar
routes.get('/', (req, res) => {
  return res.json({ message: 'IESI Backend está no ar! 🚀' });
});

// --- LINHA MAIS IMPORTANTE ---
// Aqui você diz ao Express: "Quando a URL começar com /users,
// use o arquivo 'userRoutes' que importamos"
routes.use('/users', userRoutes);
// -----------------------------

export { routes };
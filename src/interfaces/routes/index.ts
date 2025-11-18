import { Router } from 'express';
import { pessoaRoutes } from './pessoa.routes'; // <-- Importe o novo arquivo

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'IESI Hospital Backend ON! 🏥' });
});

// Agora a rota principal é /pessoas
routes.use('/pessoas', pessoaRoutes);

export { routes };
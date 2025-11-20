import { Router } from 'express';
import { pessoaRoutes } from './pessoa.routes'; 
import { authRoutes } from './auth.route';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'IESI Hospital Backend ON! 🏥' });
});

// Agora a rota principal é /pessoas
routes.use('/pessoas', pessoaRoutes);
routes.use('/',authRoutes);

export { routes };
import { Router } from 'express';
import { PessoaRepositoryPrisma } from '../../infra/repositories/PessoaRepositoryPrisma';
import { AuthenticatePessoaUseCase } from '../../domain/usecases/AuthenticatePessoaUseCase';
import { AuthenticatePessoaController } from '../controllers/AuthenticatePessoaController';
import { RecoverPasswordUseCase } from '../../domain/usecases/RecoverPasswordUseCase';
import { RecoverPasswordController } from '../controllers/RecoverPasswordController';

const authRoutes = Router();

// Injeção de dependências
const pessoaRepository = new PessoaRepositoryPrisma();
const authenticatePessoaUseCase = new AuthenticatePessoaUseCase(pessoaRepository);
const authenticatePessoaController = new AuthenticatePessoaController(authenticatePessoaUseCase);
const recoverPasswordUseCase = new RecoverPasswordUseCase(pessoaRepository);
const recoverPasswordController = new RecoverPasswordController(recoverPasswordUseCase);

// Rota POST /login
authRoutes.post('/login', authenticatePessoaController.handle.bind(authenticatePessoaController));

// Rota POST /recover-password
authRoutes.post('/recover-password', recoverPasswordController.handle.bind(recoverPasswordController));

export { authRoutes };
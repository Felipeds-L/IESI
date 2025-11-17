import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { UserRepositoryPrisma } from '../../infra/repositories/UserRepositoryPrisma';
import { CreateUserUseCase } from '../../domain/usecases/CreateUserUseCase';
import { ListUsersUseCase } from '../../domain/usecases/ListUsersUseCase';
console.log('--- [DEBUG] CARREGANDO: user.routes.ts ---');
const userRoutes = Router();

// --- INJEÇÃO DE DEPENDÊNCIA (Manual) ---
// 2. Crie a implementação
const userRepository = new UserRepositoryPrisma();

// 3. Crie os Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);

// 4. Crie o Controller
const userController = new UserController(
  createUserUseCase,
  listUsersUseCase
);
// -----------------------------------------

// 5. Defina as rotas (POST e GET)
// O .bind() é crucial para o 'this' funcionar
userRoutes.post('/', userController.create.bind(userController)); // <-- A ROTA DO POST ESTÁ AQUI
userRoutes.get('/', userController.list.bind(userController));

export { userRoutes };
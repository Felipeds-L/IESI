// src/interfaces/controllers/UserController.ts
import { Request, Response } from 'express';
// REMOVA a importação do Prisma!

// IMPORTE os Use Cases
import { CreateUserUseCase } from '../../../domain/usecases/CreateUserUseCase';
import { ListUsersUseCase } from '../../../domain/usecases/ListUsersUseCase';

export class UserController {
  
  // O Controller agora recebe os Use Cases por injeção de dependência
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUsersUseCase: ListUsersUseCase
  ) {}

  // Método para CRIAR usuário (POST /users)
  async create(req: Request, res: Response) {
    const { email, name } = req.body;
    
    try {
      // 1. Chama o Use Case (não mais o prisma)
      const user = await this.createUserUseCase.execute({ email, name });
      
      return res.status(201).json(user); // 201 = Created
    
    } catch (error: any) {
      // 2. Captura o erro (ex: "Email já em uso") vindo do Use Case
      return res.status(400).json({ error: error.message });
    }
  }

  // Método para LISTAR usuários (GET /users)
  async list(req: Request, res: Response) {
    // Chama o Use Case
    const users = await this.listUsersUseCase.execute();
    return res.json(users);
  }
}
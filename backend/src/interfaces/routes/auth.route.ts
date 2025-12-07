import { Router } from "express";
import { PessoaRepositoryPrisma } from "../../infra/repositories/PessoaRepositoryPrisma";
import { AuthenticatePessoaUseCase } from "../../domain/usecases/AuthenticatePessoaUseCase";
import { AuthenticatePessoaController } from "../controllers/AuthenticatePessoaController";

const authRoutes = Router();

// Injeção de dependências
const pessoaRepository = new PessoaRepositoryPrisma();
const authenticatePessoaUseCase = new AuthenticatePessoaUseCase(
  pessoaRepository
);
const authenticatePessoaController = new AuthenticatePessoaController(
  authenticatePessoaUseCase
);

// Rota POST /login
authRoutes.post(
  "/login",
  authenticatePessoaController.handle.bind(authenticatePessoaController)
);

export { authRoutes };

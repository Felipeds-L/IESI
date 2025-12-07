// src/interfaces/routes/pessoa.routes.ts
import { Router } from "express";
import { AgendamentoRepositoryPrisma } from "../../infra/repositories/AgendamentoRepositoryPrisma";
import { CreateAgendamentoUseCase } from "../../domain/usecases/CreateAgendamentoUseCase";

import { PessoaController } from "../controllers/PessoaController";
import { AgendamentoController } from "../controllers/AgendamentoController";

const agendamentoRoutes = Router();

// 1. Cria o repositório
const agendamentoRepository = new AgendamentoRepositoryPrisma();

// 2. Cria OS DOIS Use Cases
const createAgendamentoUseCase = new CreateAgendamentoUseCase(
  agendamentoRepository
);

// 3. Cria o Controller injetando OS DOIS Use Cases
const agendamentoController = new AgendamentoController(
  createAgendamentoUseCase
);

// 4. Define as rotas
agendamentoRoutes.post(
  "/",
  agendamentoController.create.bind(agendamentoController)
);

export { agendamentoRoutes };

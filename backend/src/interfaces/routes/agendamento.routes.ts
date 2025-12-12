// src/interfaces/routes/pessoa.routes.ts
import { Router } from "express";
import { AgendamentoRepositoryPrisma } from "../../infra/repositories/AgendamentoRepositoryPrisma";
import { CreateAgendamentoUseCase } from "../../domain/usecases/CreateAgendamentoUseCase";
import { PessoaController } from "../controllers/PessoaController";
import { AgendamentoController } from "../controllers/AgendamentoController";
import { UpdateAgendamentoUseCase } from "../../domain/usecases/UpdateAgendamentoUseCase";

const agendamentoRoutes = Router();

// 1. Cria o repositório
const agendamentoRepository = new AgendamentoRepositoryPrisma();

// 2. Cria OS DOIS Use Cases
const createAgendamentoUseCase = new CreateAgendamentoUseCase(
  agendamentoRepository
);

const updateAgendamentoUseCase = new UpdateAgendamentoUseCase(agendamentoRepository);

// 3. Cria o Controller injetando OS DOIS Use Cases
const agendamentoController = new AgendamentoController(
  createAgendamentoUseCase,
  agendamentoRepository,
  updateAgendamentoUseCase
);




// 4. Define as rotas
agendamentoRoutes.post(
  "/",
  agendamentoController.create.bind(agendamentoController)
);

agendamentoRoutes.get(
  "/",
  agendamentoController.getAll.bind(agendamentoController)
);

agendamentoRoutes.post(
  "/confirmacao",
  agendamentoController.sendConfirmation.bind(agendamentoController)
);

agendamentoRoutes.delete(
  "/:id",
  agendamentoController.delete.bind(agendamentoController)
);

agendamentoRoutes.put("/:id", agendamentoController.update.bind(agendamentoController));

export { agendamentoRoutes };

import { Router } from "express";
import { PacienteRepositoryPrisma } from "../../infra/repositories/PacienteRepositoryPrisma";
import { CreatePacienteUseCase } from "../../domain/usecases/CreatePacienteUseCase";
import { ListPacientesUseCase } from "../../domain/usecases/ListPacientesUseCase";
import { PacienteController } from "../controllers/PacienteController";

const pacienteRoutes = Router();

// Injeção de dependências
const pacienteRepository = new PacienteRepositoryPrisma();
const createPacienteUseCase = new CreatePacienteUseCase(pacienteRepository);
const listPacientesUseCase = new ListPacientesUseCase(pacienteRepository);

const pacienteController = new PacienteController(
  createPacienteUseCase,
  listPacientesUseCase
);

// Rotas
pacienteRoutes.post("/", pacienteController.create.bind(pacienteController));
pacienteRoutes.get("/", pacienteController.list.bind(pacienteController));
pacienteRoutes.get("/cpf/:cpf", pacienteController.findByCpf.bind(pacienteController));

export { pacienteRoutes };




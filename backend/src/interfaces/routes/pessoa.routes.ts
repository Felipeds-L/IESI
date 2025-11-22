// src/interfaces/routes/pessoa.routes.ts
import { Router } from "express";
import { PessoaRepositoryPrisma } from "../../infra/repositories/PessoaRepositoryPrisma";
import { CreatePessoaUseCase } from "../../domain/usecases/CreatePessoaUseCase";
import { UpdatePessoaUseCase } from "../../domain/usecases/UpdatePessoaUseCase";
import { ListPessoasUseCase } from "../../domain/usecases/ListPessoasUseCase"; // <--- IMPORTANTE
import { PessoaController } from "../controllers/PessoaController";

const pessoaRoutes = Router();

// 1. Cria o repositório
const pessoaRepository = new PessoaRepositoryPrisma();

// 2. Cria OS DOIS Use Cases
const createPessoaUseCase = new CreatePessoaUseCase(pessoaRepository);
const updatePessoaUseCase = new UpdatePessoaUseCase(pessoaRepository);
const listPessoasUseCase = new ListPessoasUseCase(pessoaRepository); // <--- IMPORTANTE

// 3. Cria o Controller injetando OS DOIS Use Cases
const pessoaController = new PessoaController(
  createPessoaUseCase,
  updatePessoaUseCase,
  listPessoasUseCase
);

// 4. Define as rotas
pessoaRoutes.post("/", pessoaController.create.bind(pessoaController));
pessoaRoutes.put("/:id", pessoaController.update.bind(pessoaController));
pessoaRoutes.get("/", pessoaController.list.bind(pessoaController));

export { pessoaRoutes };

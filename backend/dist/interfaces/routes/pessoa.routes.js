"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pessoaRoutes = void 0;
// src/interfaces/routes/pessoa.routes.ts
const express_1 = require("express");
const PessoaRepositoryPrisma_1 = require("../../infra/repositories/PessoaRepositoryPrisma");
const CreatePessoaUseCase_1 = require("../../domain/usecases/CreatePessoaUseCase");
const ListPessoasUseCase_1 = require("../../domain/usecases/ListPessoasUseCase"); // <--- IMPORTANTE
const PessoaController_1 = require("../controllers/PessoaController");
const pessoaRoutes = (0, express_1.Router)();
exports.pessoaRoutes = pessoaRoutes;
// 1. Cria o repositório
const pessoaRepository = new PessoaRepositoryPrisma_1.PessoaRepositoryPrisma();
// 2. Cria OS DOIS Use Cases
const createPessoaUseCase = new CreatePessoaUseCase_1.CreatePessoaUseCase(pessoaRepository);
const listPessoasUseCase = new ListPessoasUseCase_1.ListPessoasUseCase(pessoaRepository); // <--- IMPORTANTE
// 3. Cria o Controller injetando OS DOIS Use Cases
const pessoaController = new PessoaController_1.PessoaController(createPessoaUseCase, listPessoasUseCase // <--- O ERRO ESTAVA AQUI (Faltava passar essa variável)
);
/**
 * @swagger
 * /pessoas:
 *   post:
 *     summary: Cria uma nova pessoa
 *     tags: [Pessoas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePessoaRequest'
 *           examples:
 *             pessoaBasica:
 *               summary: Pessoa básica
 *               value:
 *                 cpf: "12345678900"
 *                 nome: "João Silva"
 *                 email: "joao.silva@example.com"
 *                 password: "senha123"
 *                 dataNascimento: "1990-01-15T00:00:00.000Z"
 *                 sexo: "M"
 *                 endereco: "Rua das Flores, 123"
 *                 telefone: "(11) 98765-4321"
 *             medico:
 *               summary: Médico
 *               value:
 *                 cpf: "98765432100"
 *                 nome: "Dr. Maria Santos"
 *                 email: "maria.santos@example.com"
 *                 password: "senha123"
 *                 dataNascimento: "1985-05-20T00:00:00.000Z"
 *                 sexo: "F"
 *                 funcionario:
 *                   dataAdmissao: "2020-01-10T00:00:00.000Z"
 *                   salario: 15000.00
 *                   cargo: "MEDICO"
 *                   crm: "CRM123456"
 *     responses:
 *       201:
 *         description: Pessoa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pessoa'
 *       400:
 *         description: Erro na validação dos dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
pessoaRoutes.post('/', pessoaController.create.bind(pessoaController));
/**
 * @swagger
 * /pessoas:
 *   get:
 *     summary: Lista todas as pessoas cadastradas
 *     tags: [Pessoas]
 *     responses:
 *       200:
 *         description: Lista de pessoas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pessoa'
 */
pessoaRoutes.get('/', pessoaController.list.bind(pessoaController));
//# sourceMappingURL=pessoa.routes.js.map
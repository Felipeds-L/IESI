"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const PessoaRepositoryPrisma_1 = require("../../infra/repositories/PessoaRepositoryPrisma");
const AuthenticatePessoaUseCase_1 = require("../../domain/usecases/AuthenticatePessoaUseCase");
const AuthenticatePessoaController_1 = require("../controllers/AuthenticatePessoaController");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
// Injeção de dependências
const pessoaRepository = new PessoaRepositoryPrisma_1.PessoaRepositoryPrisma();
const authenticatePessoaUseCase = new AuthenticatePessoaUseCase_1.AuthenticatePessoaUseCase(pessoaRepository);
const authenticatePessoaController = new AuthenticatePessoaController_1.AuthenticatePessoaController(authenticatePessoaUseCase);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "joao.silva@example.com"
 *             password: "senha123"
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               pessoa:
 *                 id: 1
 *                 cpf: "12345678900"
 *                 nome: "João Silva"
 *                 email: "joao.silva@example.com"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Email ou senha incorretos"
 */
authRoutes.post('/login', authenticatePessoaController.handle.bind(authenticatePessoaController));
//# sourceMappingURL=auth.route.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatePessoaUseCase = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthenticatePessoaUseCase {
    pessoaRepository;
    constructor(pessoaRepository) {
        this.pessoaRepository = pessoaRepository;
    }
    async execute({ email, password }) {
        // 1. Verificar se o email existe
        const pessoa = await this.pessoaRepository.findByEmail(email);
        if (!pessoa) {
            throw new Error('Email ou senha incorretos.');
        }
        // 2. Verificar se a senha bate (compara a senha enviada com o hash do banco)
        const passwordMatch = await (0, bcryptjs_1.compare)(password, pessoa.password);
        if (!passwordMatch) {
            throw new Error('Email ou senha incorretos.');
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('Erro interno: JWT_SECRET não está definido no .env');
        }
        const token = (0, jsonwebtoken_1.sign)({}, process.env.JWT_SECRET, {
            subject: String(pessoa.id),
            expiresIn: '1d',
        });
        // 4. Tentar descobrir o cargo (se for funcionário) para facilitar pro Front
        // O prisma retorna o objeto completo, então podemos checar se tem funcionario
        const cargo = pessoa.funcionario?.cargo || 'PACIENTE';
        return {
            pessoa: {
                id: pessoa.id,
                nome: pessoa.nome,
                email: pessoa.email,
                cargo,
            },
            token,
        };
    }
}
exports.AuthenticatePessoaUseCase = AuthenticatePessoaUseCase;
//# sourceMappingURL=AuthenticatePessoaUseCase.js.map
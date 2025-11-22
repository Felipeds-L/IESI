"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessoaRepositoryPrisma = void 0;
const client_1 = require("../database/prisma/client");
class PessoaRepositoryPrisma {
    async findByCpf(cpf) {
        return await client_1.prisma.pessoa.findUnique({ where: { cpf } });
    }
    async findByEmail(email) {
        return await client_1.prisma.pessoa.findUnique({ where: { email } });
    }
    async create(data) {
        // O Prisma permite criar relacionamentos aninhados (Nested Writes)
        return await client_1.prisma.pessoa.create({
            data: {
                // 1. Dados Básicos
                cpf: data.cpf,
                nome: data.nome,
                email: data.email,
                password: data.password,
                dataNascimento: data.dataNascimento,
                sexo: data.sexo,
                endereco: data.endereco,
                telefone: data.telefone,
                // 2. Se tiver dados de PACIENTE, cria o registro na tabela Paciente
                paciente: data.paciente
                    ? {
                        create: {
                            convenioId: data.paciente.convenioId,
                        },
                    }
                    : undefined,
                // 3. Se tiver dados de FUNCIONÁRIO, cria o registro na tabela Funcionario
                funcionario: data.funcionario
                    ? {
                        create: {
                            dataAdmissao: data.funcionario.dataAdmissao,
                            salario: data.funcionario.salario,
                            cargo: data.funcionario.cargo,
                            crm: data.funcionario.crm,
                            coren: data.funcionario.coren,
                            // Conecta as especialidades (se houver)
                            especialidades: data.funcionario.especialidadeIds
                                ? {
                                    connect: data.funcionario.especialidadeIds.map((id) => ({
                                        id,
                                    })),
                                }
                                : undefined,
                        },
                    }
                    : undefined,
            },
            // Inclui os dados criados na resposta para conferência
            include: {
                paciente: true,
                funcionario: true,
            },
        });
    }
    async findAll() {
        return await client_1.prisma.pessoa.findMany({
            include: {
                paciente: true, // Traz os dados de paciente junto
                funcionario: true, // Traz os dados de funcionário junto
            },
        });
    }
    async update(id, data) {
        return await client_1.prisma.pessoa.update({
            where: { id },
            data: {
                ...data,
                paciente: data.paciente
                    ? {
                        update: {
                            convenioId: data.paciente.convenioId,
                        },
                    }
                    : undefined,
                funcionario: data.funcionario
                    ? {
                        update: {
                            dataAdmissao: data.funcionario.dataAdmissao,
                            salario: data.funcionario.salario,
                            cargo: data.funcionario.cargo,
                            crm: data.funcionario.crm,
                            coren: data.funcionario.coren,
                            especialidades: data.funcionario.especialidadeIds
                                ? {
                                    connect: data.funcionario.especialidadeIds.map((id) => ({
                                        id,
                                    })),
                                }
                                : undefined,
                        },
                    }
                    : undefined,
            },
            include: {
                paciente: true,
                funcionario: true,
            },
        });
    }
    async delete(id) {
        await client_1.prisma.pessoa.delete({ where: { id } });
    }
}
exports.PessoaRepositoryPrisma = PessoaRepositoryPrisma;
//# sourceMappingURL=PessoaRepositoryPrisma.js.map
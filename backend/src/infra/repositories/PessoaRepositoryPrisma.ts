import { prisma } from "../database/prisma/client";
import {
  IPessoaRepository,
  CreatePessoaDTO,
} from "../../domain/repositories/IPessoaRepository";
import { Pessoa } from "@prisma/client";

export class PessoaRepositoryPrisma implements IPessoaRepository {
  async findByCpf(cpf: string): Promise<Pessoa | null> {
    return await prisma.pessoa.findUnique({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<Pessoa | null> {
    return await prisma.pessoa.findUnique({ where: { email } });
  }

  async create(data: CreatePessoaDTO): Promise<Pessoa> {
    // O Prisma permite criar relacionamentos aninhados (Nested Writes)
    return await prisma.pessoa.create({
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
              },
            }
          : undefined,
        paciente: data.paciente
          ? {
              create: {},
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
  async findAll(): Promise<Pessoa[]> {
    return await prisma.pessoa.findMany({
      include: {
        paciente: true, // Traz os dados de paciente junto
        funcionario: true, // Traz os dados de funcionário junto
      },
    });
  }

  async update(id: number, data: Partial<CreatePessoaDTO>): Promise<Pessoa> {
    return await prisma.pessoa.update({
      where: { id },
      data: {
        ...data,
        funcionario: data.funcionario
          ? {
              update: {
                dataAdmissao: data.funcionario.dataAdmissao,
                salario: data.funcionario.salario,
                cargo: data.funcionario.cargo,
                crm: data.funcionario.crm,
                coren: data.funcionario.coren,
              },
            }
          : undefined,
        paciente: data.paciente ? { update: {} } : undefined,
      },
      include: {
        paciente: true,
        funcionario: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.pessoa.delete({ where: { id } });
  }
}

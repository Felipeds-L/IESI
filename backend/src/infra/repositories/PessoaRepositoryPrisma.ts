import { prisma } from "../database/prisma/client";
import {
  IPessoaRepository,
  CreatePessoaDTO,
} from "../../domain/repositories/IPessoaRepository";
import { Pessoa } from "@prisma/client";

type PessoaComFuncionario = Pessoa & {
  funcionario: {
    cpf: string;
    password: string;
  } | null;
};

export class PessoaRepositoryPrisma implements IPessoaRepository {
  async findByCpf(cpf: string): Promise<PessoaComFuncionario | null> {
    return (await prisma.pessoa.findFirst({
      where: {
        funcionario: {  
          cpf: cpf,
        },
      }, 
      include: {
        funcionario: true,
      },
    })) as PessoaComFuncionario | null;
  }

  async create(data: CreatePessoaDTO): Promise<Pessoa> {
    // O Prisma permite criar relacionamentos aninhados (Nested Writes)
    return await prisma.pessoa.create({
      data: {
        // 1. Dados Básicos
        nome: data.nome,
        // 3. Se tiver dados de FUNCIONÁRIO, cria o registro na tabela Funcionario
        funcionario: data.funcionario
          ? {
              create: {
                crm: data.funcionario.crm,
                cpf: data.funcionario.cpf,
                password: data.funcionario.password
                // Conecta as especialidades (se houver)
              },
            }
          : undefined,
      },
      // Inclui os dados criados na resposta para conferência
      include: {
        funcionario: true,
      },
    });
  }
  async findAll(): Promise<Pessoa[]> {
    return await prisma.pessoa.findMany({
      include: {
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
                crm: data.funcionario.crm,
                cpf: data.funcionario.cpf,
                password: data.funcionario.password
              },
            }
          : undefined,
      },
      include: {
        funcionario: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.pessoa.delete({ where: { id } });
  }
}

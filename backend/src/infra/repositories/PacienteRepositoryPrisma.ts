import { prisma } from "../database/prisma/client";
import {
  IPacienteRepository,
  CreatePacienteDTO,
} from "../../domain/repositories/IPacienteRepository";
import { Pessoa } from "@prisma/client";

type PessoaComPaciente = Pessoa & {
  paciente: {
    cpf: string;
    dataNascimento?: Date | null;
    sexo?: string | null;
    responsavelNome?: string | null;
  } | null;
};

export class PacienteRepositoryPrisma implements IPacienteRepository {
  async findByCpf(cpf: string): Promise<PessoaComPaciente | null> {
    return (await prisma.pessoa.findFirst({
      where: {
        paciente: {
          cpf: cpf,
        },
      },
      include: {
        paciente: true,
      },
    })) as PessoaComPaciente | null;
  }

  async findById(id: number): Promise<PessoaComPaciente | null> {
    return (await prisma.pessoa.findUnique({
      where: { id },
      include: {
        paciente: true,
      },
    })) as PessoaComPaciente | null;
  }

  async create(data: CreatePacienteDTO): Promise<Pessoa> {
    console.log("[REPOSITORY] PacienteRepositoryPrisma.create iniciado");
    console.log("[REPOSITORY] Dados para criar:", JSON.stringify(data, null, 2));
    
    try {
      console.log("[REPOSITORY] Preparando dados para Prisma...");
      const prismaData = {
        nome: data.nome,
        paciente: {
          create: {
            cpf: data.cpf,
            dataNascimento: data.dataNascimento,
            sexo: data.sexo,
            responsavelNome: data.responsavelNome,
          },
        },
      };
      console.log("[REPOSITORY] Dados do Prisma:", JSON.stringify(prismaData, null, 2));
      
      console.log("[REPOSITORY] Chamando prisma.pessoa.create...");
      const result = await prisma.pessoa.create({
        data: prismaData,
        include: {
          paciente: true,
        },
      });
      
      console.log("[REPOSITORY] Paciente criado no banco com sucesso!");
      console.log("[REPOSITORY] Resultado:", JSON.stringify(result, null, 2));
      return result;
    } catch (error: any) {
      console.error("[REPOSITORY] Erro ao criar paciente no Prisma:", error);
      console.error("[REPOSITORY] Mensagem de erro:", error.message);
      console.error("[REPOSITORY] Stack trace:", error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Pessoa[]> {
    return await prisma.pessoa.findMany({
      where: {
        paciente: {
          isNot: null,
        },
      },
      include: {
        paciente: true,
      },
    });
  }

  async update(id: number, data: Partial<CreatePacienteDTO>): Promise<Pessoa> {
    return await prisma.pessoa.update({
      where: { id },
      data: {
        nome: data.nome,
        paciente: data.cpf || data.dataNascimento || data.sexo || data.responsavelNome
          ? {
              update: {
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                sexo: data.sexo,
                responsavelNome: data.responsavelNome,
              },
            }
          : undefined,
      },
      include: {
        paciente: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.pessoa.delete({ where: { id } });
  }
}


// src/infra/repositories/AgendamentoRepositoryPrisma.ts

import { prisma } from "../database/prisma/client";
import {
  IAgendamentoRepository,
  CreateAgendamentoDTO,
} from "../../domain/repositories/IAgendamentoRepository";
import { Agendamento } from "@prisma/client";

export class AgendamentoRepositoryPrisma implements IAgendamentoRepository {
  async create(data: CreateAgendamentoDTO): Promise<Agendamento> {
    return await prisma.agendamento.create({
      data: {
        dataHora: data.dataHora,
        status: data.status,
        tipoConsulta: data.tipoConsulta,
        especialidade: data.especialidade,
        descricao: data.descricao,
        sexo: data.sexo,
        idade: data.idade,
        responsavelNome: data.responsavelNome,
        nomePaciente: data.nomePaciente,
        funcionarioId: data.funcionarioId,
        pacienteId: data.pacienteId,
      },
      include: {
        funcionario: true,
        paciente: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  async findAll(funcionarioId?: number): Promise<Agendamento[]> {
    return await prisma.agendamento.findMany({
      where: funcionarioId ? { funcionarioId } : undefined,
      include: {
        funcionario: true,
        paciente: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Agendamento | null> {
    return await prisma.agendamento.findUnique({
      where: { id },
      include: {
        funcionario: true,
        paciente: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }
}

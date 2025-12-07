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
        custo: data.custo,
        pagador: data.pagador,
        pacienteId: data.pacienteId,
        funcionarioId: data.funcionarioId,
      },
      include: {
        paciente: true,
        funcionario: true,
      },
    });
  }

  async findAll(): Promise<Agendamento[]> {
    return await prisma.agendamento.findMany({
      include: {
        paciente: true,
        funcionario: true,
      },
    });
  }

  async findById(id: number): Promise<Agendamento | null> {
    return await prisma.agendamento.findUnique({
      where: { id },
      include: {
        paciente: true,
        funcionario: true,
      },
    });
  }
}

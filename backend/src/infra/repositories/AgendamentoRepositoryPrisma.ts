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
      },
      include: {
        funcionario: true,
      },
    });
  }

  async findAll(): Promise<Agendamento[]> {
    return await prisma.agendamento.findMany({
      include: {
        funcionario: true,
      },
    });
  }

  async findById(id: number): Promise<Agendamento | null> {
    return await prisma.agendamento.findUnique({
      where: { id },
      include: {
        funcionario: true,
      },
    });
  }
}

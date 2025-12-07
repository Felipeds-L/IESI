import {
  IAgendamentoRepository,
  CreateAgendamentoDTO,
} from "../repositories/IAgendamentoRepository";
import { prisma } from "../../infra/database/prisma/client";

export class CreateAgendamentoUseCase {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async execute(data: CreateAgendamentoDTO) {
    // Verifica se paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: data.pacienteId },
    });

    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }

    // Verifica se funcionário existe
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: data.funcionarioId },
    });

    if (!funcionario) {
      throw new Error("Funcionário não encontrado.");
    }

    // Valida data futura
    if (new Date(data.dataHora) < new Date()) {
      throw new Error("A data do agendamento deve ser futura.");
    }

    // Cria o agendamento
    const agendamento = await this.agendamentoRepository.create(data);
    return agendamento;
  }
}

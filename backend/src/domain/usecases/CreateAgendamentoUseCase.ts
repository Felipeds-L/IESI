import {
  IAgendamentoRepository,
  CreateAgendamentoDTO,
} from "../repositories/IAgendamentoRepository";
import { prisma } from "../../infra/database/prisma/client";

export class CreateAgendamentoUseCase {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async execute(data: CreateAgendamentoDTO) {

    // Verifica se funcionário existe
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: data.funcionarioId },
    });

    if (!funcionario) {
      throw new Error("Funcionário não encontrado.");
    }

    // Se tiver pacienteId, verifica se o paciente existe
    if (data.pacienteId) {
      const paciente = await prisma.paciente.findUnique({
        where: { id: data.pacienteId },
        include: { pessoa: true },
      });

      if (!paciente) {
        throw new Error("Paciente não encontrado.");
      }

      // Preenche dados do paciente automaticamente se não fornecidos
      if (!data.nomePaciente) {
        data.nomePaciente = paciente.pessoa.nome;
      }
      if (!data.sexo && paciente.sexo) {
        data.sexo = paciente.sexo;
      }
      if (!data.responsavelNome && paciente.responsavelNome) {
        data.responsavelNome = paciente.responsavelNome;
      }
      if (!data.idade && paciente.dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(paciente.dataNascimento);
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        data.idade = mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate()) ? idade - 1 : idade;
      }
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

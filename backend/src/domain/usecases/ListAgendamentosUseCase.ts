import { IAgendamentoRepository } from "../repositories/IAgendamentoRepository";

export class ListAgendamentosUseCase {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async execute() {
    return await this.agendamentoRepository.findAll();
  }
}

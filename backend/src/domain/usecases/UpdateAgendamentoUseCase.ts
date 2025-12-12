import { IAgendamentoRepository, CreateAgendamentoDTO } from "../repositories/IAgendamentoRepository";

export class UpdateAgendamentoUseCase {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async execute(id: number, data: Partial<CreateAgendamentoDTO>) {
    return await this.agendamentoRepository.update(id, data);
  }
}
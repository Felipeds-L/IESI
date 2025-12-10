import { IPacienteRepository } from "../repositories/IPacienteRepository";

export class ListPacientesUseCase {
  constructor(private pacienteRepository: IPacienteRepository) {}

  async execute() {
    const pacientes = await this.pacienteRepository.findAll();
    return pacientes;
  }
}




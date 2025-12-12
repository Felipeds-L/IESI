import { Agendamento } from "@prisma/client";

export interface CreateAgendamentoDTO {
  dataHora: Date;
  status: string;
  tipoConsulta: string;
  especialidade?: string;
  descricao?: string;
  nomePaciente?: string; // Opcional se tiver pacienteId
  sexo?: string;
  idade?: number;
  responsavelNome?: string;
  funcionarioId: number; // obrigatório
  pacienteId?: number; // ID do paciente cadastrado (opcional)
}

export interface IAgendamentoRepository {
  create(data: CreateAgendamentoDTO): Promise<Agendamento>;
  findAll(funcionarioId?: number): Promise<Agendamento[]>;
  findById(id: number): Promise<Agendamento | null>;
  delete(id: number): Promise<void>;
  
}

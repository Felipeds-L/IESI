import { Agendamento } from "@prisma/client";

export interface CreateAgendamentoDTO {
  dataHora: Date;
  status: string;
  tipoConsulta: string;
  especialidade?: string;
  descricao?: string;
  nomePaciente: string;
  sexo?: string;
  idade?: number;
  responsavelNome?: string;
  funcionarioId: number; // obrigatório
}

export interface IAgendamentoRepository {
  create(data: CreateAgendamentoDTO): Promise<Agendamento>;
  findAll(): Promise<Agendamento[]>;
  findById(id: number): Promise<Agendamento | null>;
}

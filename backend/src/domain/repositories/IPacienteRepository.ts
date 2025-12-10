import { Pessoa } from "@prisma/client";

// Dados para criar um Paciente
export interface CreatePacienteDTO {
  nome: string;
  cpf: string;
  dataNascimento?: Date;
  sexo?: string;
  responsavelNome?: string;
}

type PessoaComPaciente = Pessoa & {
  paciente: {
    cpf: string;
    dataNascimento?: Date | null;
    sexo?: string | null;
    responsavelNome?: string | null;
  } | null;
};

export interface IPacienteRepository {
  findByCpf(cpf: string): Promise<PessoaComPaciente | null>;
  findById(id: number): Promise<PessoaComPaciente | null>;
  create(data: CreatePacienteDTO): Promise<Pessoa>;
  findAll(): Promise<Pessoa[]>;
  update(id: number, data: Partial<CreatePacienteDTO>): Promise<Pessoa>;
  delete(id: number): Promise<void>;
}




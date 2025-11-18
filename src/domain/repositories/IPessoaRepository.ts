import { Pessoa, Paciente, Funcionario, Cargo } from '@prisma/client';

// Dados para criar uma Pessoa (e seus vínculos opcionais)
export interface CreatePessoaDTO {
  // Dados Comuns (Pessoa)
  cpf: string;
  nome: string;
  email: string;
  password: string; // Senha para login futuro
  dataNascimento: Date;
  sexo?: string;
  endereco?: string;
  telefone?: string;

  // Dados Opcionais de Paciente
  paciente?: {
    convenioId?: number;
  };

  // Dados Opcionais de Funcionario
  funcionario?: {
    dataAdmissao: Date;
    salario?: number;
    cargo: Cargo;
    crm?: string;
    coren?: string;
    especialidadeIds?: number[]; // Lista de IDs das especialidades
  };
}

export interface IPessoaRepository {
  findByCpf(cpf: string): Promise<Pessoa | null>;
  findByEmail(email: string): Promise<Pessoa | null>;
  create(data: CreatePessoaDTO): Promise<Pessoa>;
  findAll(): Promise<Pessoa[]>;
}
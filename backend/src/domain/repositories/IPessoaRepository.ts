import { Pessoa } from "@prisma/client";

// Dados para criar uma Pessoa (e seus vínculos opcionais)
export interface CreatePessoaDTO {
  // Dados Comuns (Pessoa)

  nome: string;

  // Dados Opcionais de Funcionario
  funcionario?: {
    cpf: string;
    password: string;
    crm?: string;
  };

  paciente?: {
    sexo?: string;
    idade?: number;
    responsavelNome?: string;
  };
}

type PessoaComFuncionario = Pessoa & {
  funcionario: {
    cpf: string;
    password: string;
  } | null;
};

export interface IPessoaRepository {
  findByCpf(cpf: string): Promise<PessoaComFuncionario | null>;
  create(data: CreatePessoaDTO): Promise<Pessoa>;
  findAll(): Promise<Pessoa[]>;
  update(id: number, data: Partial<CreatePessoaDTO>): Promise<Pessoa>;
  delete(id: number): Promise<void>;
}

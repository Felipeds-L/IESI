import { Pessoa, Cargo } from "@prisma/client";
export interface CreatePessoaDTO {
    cpf: string;
    nome: string;
    email: string;
    password: string;
    dataNascimento: Date;
    sexo?: string;
    endereco?: string;
    telefone?: string;
    paciente?: {
        convenioId?: number;
    };
    funcionario?: {
        dataAdmissao: Date;
        salario?: number;
        cargo: Cargo;
        crm?: string;
        coren?: string;
        especialidadeIds?: number[];
    };
}
export interface IPessoaRepository {
    findByCpf(cpf: string): Promise<Pessoa | null>;
    findByEmail(email: string): Promise<Pessoa | null>;
    create(data: CreatePessoaDTO): Promise<Pessoa>;
    findAll(): Promise<Pessoa[]>;
    update(id: number, data: Partial<CreatePessoaDTO>): Promise<Pessoa>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=IPessoaRepository.d.ts.map
import { IPessoaRepository, CreatePessoaDTO } from "../../domain/repositories/IPessoaRepository";
import { Pessoa } from "@prisma/client";
export declare class PessoaRepositoryPrisma implements IPessoaRepository {
    findByCpf(cpf: string): Promise<Pessoa | null>;
    findByEmail(email: string): Promise<Pessoa | null>;
    create(data: CreatePessoaDTO): Promise<Pessoa>;
    findAll(): Promise<Pessoa[]>;
    update(id: number, data: Partial<CreatePessoaDTO>): Promise<Pessoa>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=PessoaRepositoryPrisma.d.ts.map
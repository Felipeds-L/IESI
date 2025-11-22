import { IPessoaRepository } from '../repositories/IPessoaRepository';
import { Pessoa } from '@prisma/client';
export declare class ListPessoasUseCase {
    private pessoaRepository;
    constructor(pessoaRepository: IPessoaRepository);
    execute(): Promise<Pessoa[]>;
}
//# sourceMappingURL=ListPessoasUseCase.d.ts.map
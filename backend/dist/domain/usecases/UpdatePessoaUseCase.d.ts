import { IPessoaRepository, CreatePessoaDTO } from "../repositories/IPessoaRepository";
export declare class UpdatePessoaUseCase {
    private pessoaRepository;
    constructor(pessoaRepository: IPessoaRepository);
    execute(id: string, data: Partial<CreatePessoaDTO>): Promise<Pessoa>;
}
//# sourceMappingURL=UpdatePessoaUseCase.d.ts.map
import { IPessoaRepository, CreatePessoaDTO } from "../repositories/IPessoaRepository";
export declare class CreatePessoaUseCase {
    private pessoaRepository;
    constructor(pessoaRepository: IPessoaRepository);
    execute(data: CreatePessoaDTO): Promise<Pessoa>;
}
//# sourceMappingURL=CreatePessoaUseCase.d.ts.map
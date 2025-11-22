import { IPessoaRepository } from '../repositories/IPessoaRepository';
interface IRequest {
    email: string;
    password: string;
}
interface IResponse {
    pessoa: {
        id: number;
        nome: string;
        email: string;
        cargo?: string | null;
    };
    token: string;
}
export declare class AuthenticatePessoaUseCase {
    private pessoaRepository;
    constructor(pessoaRepository: IPessoaRepository);
    execute({ email, password }: IRequest): Promise<IResponse>;
}
export {};
//# sourceMappingURL=AuthenticatePessoaUseCase.d.ts.map
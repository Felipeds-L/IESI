import { Request, Response } from 'express';
import { AuthenticatePessoaUseCase } from '../../domain/usecases/AuthenticatePessoaUseCase';
export declare class AuthenticatePessoaController {
    private authenticatePessoaUseCase;
    constructor(authenticatePessoaUseCase: AuthenticatePessoaUseCase);
    handle(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=AuthenticatePessoaController.d.ts.map
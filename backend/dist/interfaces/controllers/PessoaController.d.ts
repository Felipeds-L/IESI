import { Request, Response } from 'express';
import { CreatePessoaUseCase } from '../../domain/usecases/CreatePessoaUseCase';
import { ListPessoasUseCase } from '../../domain/usecases/ListPessoasUseCase';
export declare class PessoaController {
    private createPessoaUseCase;
    private listPessoasUseCase;
    constructor(createPessoaUseCase: CreatePessoaUseCase, listPessoasUseCase: ListPessoasUseCase);
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PessoaController.d.ts.map
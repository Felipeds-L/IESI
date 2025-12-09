import { Request, Response } from 'express';
import { AuthenticatePessoaUseCase } from '../../domain/usecases/AuthenticatePessoaUseCase';

export class AuthenticatePessoaController {
  constructor(private authenticatePessoaUseCase: AuthenticatePessoaUseCase) {}

  async handle(req: Request, res: Response) {
    const { cpf, password } = req.body;

    try {
      const result = await this.authenticatePessoaUseCase.execute({
        funcionario: {
            cpf,
            password,
        }
      });

      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
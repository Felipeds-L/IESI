import { Request, Response } from 'express';
import { RecoverPasswordUseCase } from '../../domain/usecases/RecoverPasswordUseCase';

export class RecoverPasswordController {
  constructor(private recoverPasswordUseCase: RecoverPasswordUseCase) {}

  async handle(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    try {
      const result = await this.recoverPasswordUseCase.execute({ email });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}


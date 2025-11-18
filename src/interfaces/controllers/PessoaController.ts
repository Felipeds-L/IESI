// src/interfaces/controllers/PessoaController.ts
import { Request, Response } from 'express';
import { CreatePessoaUseCase } from '../../domain/usecases/CreatePessoaUseCase';
import { ListPessoasUseCase } from '../../domain/usecases/ListPessoasUseCase'; // <--- Importação Essencial

export class PessoaController {
  // O construtor PRECISA receber os dois UseCases
  constructor(
    private createPessoaUseCase: CreatePessoaUseCase,
    private listPessoasUseCase: ListPessoasUseCase // <--- Se essa linha faltar, o erro acontece
  ) {}

  async create(req: Request, res: Response) {
    const data = req.body;

    // Conversão de datas
    if (data.dataNascimento) data.dataNascimento = new Date(data.dataNascimento);
    if (data.funcionario?.dataAdmissao) data.funcionario.dataAdmissao = new Date(data.funcionario.dataAdmissao);

    try {
      const pessoa = await this.createPessoaUseCase.execute(data);
      return res.status(201).json(pessoa);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    // Agora 'this.listPessoasUseCase' vai existir!
    const pessoas = await this.listPessoasUseCase.execute();
    return res.json(pessoas);
  }
}
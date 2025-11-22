// src/interfaces/controllers/PessoaController.ts
import { Request, Response } from "express";
import { CreatePessoaUseCase } from "../../domain/usecases/CreatePessoaUseCase";
import { ListPessoasUseCase } from "../../domain/usecases/ListPessoasUseCase"; // <--- Importação Essencial
import { UpdatePessoaUseCase } from "../../domain/usecases/UpdatePessoaUseCase";

export class PessoaController {
  // O construtor PRECISA receber os dois UseCases
  constructor(
    private createPessoaUseCase: CreatePessoaUseCase,
    private updatePessoaUseCase: UpdatePessoaUseCase,
    private listPessoasUseCase: ListPessoasUseCase // <--- Se essa linha faltar, o erro acontece
  ) {}

  async create(req: Request, res: Response) {
    const data = req.body;

    // Conversão de datas
    if (data.dataNascimento)
      data.dataNascimento = new Date(data.dataNascimento);
    if (data.funcionario?.dataAdmissao)
      data.funcionario.dataAdmissao = new Date(data.funcionario.dataAdmissao);

    try {
      const pessoa = await this.createPessoaUseCase.execute(data);
      return res.status(201).json(pessoa);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;

    // Conversão de datas
    if (data.dataNascimento)
      data.dataNascimento = new Date(data.dataNascimento);
    if (data.funcionario?.dataAdmissao)
      data.funcionario.dataAdmissao = new Date(data.funcionario.dataAdmissao);

    try {
      const pessoa = await this.updatePessoaUseCase.execute(id, data);
      return res.status(200).json(pessoa);
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

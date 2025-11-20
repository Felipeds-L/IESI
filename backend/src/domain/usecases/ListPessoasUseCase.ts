// src/domain/usecases/ListPessoasUseCase.ts
import { IPessoaRepository } from '../repositories/IPessoaRepository';
import { Pessoa } from '@prisma/client';

export class ListPessoasUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute(): Promise<Pessoa[]> {
    const pessoas = await this.pessoaRepository.findAll();
    return pessoas;
  }
}
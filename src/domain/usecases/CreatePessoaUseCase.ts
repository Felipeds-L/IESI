// src/domain/usecases/CreatePessoaUseCase.ts
import { IPessoaRepository, CreatePessoaDTO } from '../repositories/IPessoaRepository';

export class CreatePessoaUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute(data: CreatePessoaDTO) {
    // 1. Validação de CPF duplicado
    const cpfExists = await this.pessoaRepository.findByCpf(data.cpf);
    if (cpfExists) {
      throw new Error('CPF já cadastrado no sistema.');
    }

    // 2. Validação de Email duplicado
    const emailExists = await this.pessoaRepository.findByEmail(data.email);
    if (emailExists) {
      throw new Error('Email já cadastrado no sistema.');
    }

    // 3. Criar a pessoa
    const pessoa = await this.pessoaRepository.create(data);
    return pessoa;
  }
}
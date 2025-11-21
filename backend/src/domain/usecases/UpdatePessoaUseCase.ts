import {
  IPessoaRepository,
  CreatePessoaDTO,
} from "../repositories/IPessoaRepository";

export class UpdatePessoaUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute(id: string, data: Partial<CreatePessoaDTO>) {
    // Implementar validações e lógica de atualização conforme necessário
    const pessoa = await this.pessoaRepository.update(id, data);
    return pessoa;
  }
}

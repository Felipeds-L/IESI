import {
  IPessoaRepository,
  CreatePessoaDTO,
} from "../repositories/IPessoaRepository";
import { hash } from "bcryptjs";

export class CreatePessoaUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute(data: CreatePessoaDTO) {
    // Garante que tem texto + @ + texto + . + texto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("O email informado é inválido.");
    }

    // 2. Valida Tamanho da Senha
    if (data.password.length < 6) {
      throw new Error("A senha deve ter no mínimo 6 caracteres.");
    }

    // Valida Formato do CPF (Apenas verifica se tem 11 números ou formato padrão)
    const cpfLimpo = data.cpf.replace(/[^\d]+/g, "");
    if (cpfLimpo.length !== 11) {
      throw new Error("O CPF deve conter 11 dígitos.");
    }

    // 4. Valida se já existe (Regras de Negócio)
    const cpfExists = await this.pessoaRepository.findByCpf(data.cpf);
    if (cpfExists) throw new Error("CPF já cadastrado no sistema.");

    const emailExists = await this.pessoaRepository.findByEmail(data.email);
    if (emailExists) throw new Error("Email já cadastrado no sistema.");

    // 5. Criptografa senha
    const passwordHash = await hash(data.password, 8);
    data.password = passwordHash;

    // 6. Cria
    const pessoa = await this.pessoaRepository.create(data);
    return pessoa;
  }
}

import {
  IPessoaRepository,
  CreatePessoaDTO,
} from "../repositories/IPessoaRepository";
import { hash } from "bcryptjs";

export class CreatePessoaUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute(data: CreatePessoaDTO) {
    if (!data.funcionario) {
      throw new Error("Dados de funcionário são obrigatórios.");
    }

    // 1. Valida Tamanho da Senha
    if (data.funcionario.password.length < 6) {
      throw new Error("A senha deve ter no mínimo 6 caracteres.");
    }

    // 2. Valida Formato do CPF (Apenas verifica se tem 11 números ou formato padrão)
    const cpfLimpo = data.funcionario.cpf.replace(/[^\d]+/g, "");
    if (cpfLimpo.length !== 11) {
      throw new Error("O CPF deve conter 11 dígitos.");
    }

    // 3. Normaliza CPF (remove formatação)
    data.funcionario.cpf = cpfLimpo;

    // 4. Valida CRM se for médico
    const cargo = data.funcionario.cargo?.toUpperCase() || 'MEDICO';
    if (cargo === 'MEDICO' && (!data.funcionario.crm || data.funcionario.crm.trim() === '')) {
      throw new Error("CRM é obrigatório para médicos.");
    }

    // 5. Valida se já existe (Regras de Negócio)
    const cpfExists = await this.pessoaRepository.findByCpf(data.funcionario.cpf);
    if (cpfExists) throw new Error("CPF já cadastrado no sistema.");

    // 6. Define cargo padrão se não fornecido
    if (!data.funcionario.cargo) {
      data.funcionario.cargo = 'MEDICO';
    } else {
      data.funcionario.cargo = cargo;
    }

    // 7. Criptografa senha
    const passwordHash = await hash(data.funcionario.password, 8);
    data.funcionario.password = passwordHash;

    // 8. Cria
    const pessoa = await this.pessoaRepository.create(data);
    return pessoa;
  }
}

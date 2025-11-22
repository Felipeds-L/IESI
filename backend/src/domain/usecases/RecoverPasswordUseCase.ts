import { hash } from 'bcryptjs';
import { IPessoaRepository } from '../repositories/IPessoaRepository';

interface IRequest {
  email: string;
}

export class RecoverPasswordUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute({ email }: IRequest): Promise<{ message: string; newPassword?: string }> {
    // 1. Verificar se o email existe
    const pessoa = await this.pessoaRepository.findByEmail(email);
    if (!pessoa) {
      // Por segurança, não revelamos se o email existe ou não
      return {
        message: 'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha.',
      };
    }

    // 2. Gerar uma nova senha temporária
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + '123';
    
    // 3. Hash da nova senha
    const passwordHash = await hash(newPassword, 8);

    // 4. Atualizar a senha no banco
    await this.pessoaRepository.update(pessoa.id, {
      password: passwordHash,
    });

    // 5. Retornar a nova senha (em produção, enviaria por email)
    return {
      message: 'Nova senha gerada com sucesso!',
      newPassword, // Em produção, não retornaríamos isso, apenas enviaríamos por email
    };
  }
}


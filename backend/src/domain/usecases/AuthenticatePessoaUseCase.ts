import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IPessoaRepository } from '../repositories/IPessoaRepository';

// O que precisamos receber para logar
interface IRequest {
  email: string;
  password: string;
}

// O que vamos devolver (o Token e os dados do usuário)
interface IResponse {
  pessoa: {
    id: number;
    nome: string;
    email: string;
    cargo?: string | null; // Opcional, ajuda o front a saber quem é
  };
  token: string;
}

export class AuthenticatePessoaUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    // 1. Verificar se o email existe
    const pessoa = await this.pessoaRepository.findByEmail(email);
    if (!pessoa) {
      throw new Error('Email ou senha incorretos.');
    }

    // 2. Verificar se a senha bate (compara a senha enviada com o hash do banco)
    const passwordMatch = await compare(password, pessoa.password);
    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos.');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('Erro interno: JWT_SECRET não está definido no .env');
    }

    const token = sign({}, process.env.JWT_SECRET, { // <--- Agora lê do .env
      subject: String(pessoa.id),
      expiresIn: '1d',
    });

    // 4. Tentar descobrir o cargo (se for funcionário) para facilitar pro Front
    // O prisma retorna o objeto completo, então podemos checar se tem funcionario
    const cargo = (pessoa as any).funcionario?.cargo || 'PACIENTE';

    return {
      pessoa: {
        id: pessoa.id,
        nome: pessoa.nome,
        email: pessoa.email,
        cargo,
      },
      token,
    };
  }
}
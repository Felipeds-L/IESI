import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IPessoaRepository } from '../repositories/IPessoaRepository';

// O que precisamos receber para logar
interface IRequest {
  funcionario:{
    cpf: string;
    password: string;
  }
  
}

// O que vamos devolver (o Token e os dados do usuário)
interface IResponse {
  pessoa: {
    id: number;
    nome: string;
    funcionario?: {
      cpf: string;
    }
  };
  token: string;
}

export class AuthenticatePessoaUseCase {
  constructor(private pessoaRepository: IPessoaRepository) {}

  async execute({ funcionario }: IRequest): Promise<IResponse> {
    // 1. Verificar se o email existe
    const pessoa = await this.pessoaRepository.findByCpf(funcionario.cpf);
    if (!pessoa || !pessoa.funcionario) {
      throw new Error('Cpf ou senha incorretos.');
    }

    // 2. Verificar se a senha bate (compara a senha enviada com o hash do banco)
    const passwordMatch = await compare(funcionario.password, pessoa.funcionario.password);
    if (!passwordMatch) {
      throw new Error('Cpf ou senha incorretos.');
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
        funcionario:{
          cpf: (pessoa as any).funcionario?.cpf
        }
      },
      token,
    };
  }
}
import { prisma } from '../database/prisma/client';
import { IPessoaRepository, CreatePessoaDTO } from '../../domain/repositories/IPessoaRepository';
import { Pessoa } from '@prisma/client';

export class PessoaRepositoryPrisma implements IPessoaRepository {
  
  async findByCpf(cpf: string): Promise<Pessoa | null> {
    return await prisma.pessoa.findUnique({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<Pessoa | null> {
    return await prisma.pessoa.findUnique({ where: { email } });
  }

  async create(data: CreatePessoaDTO): Promise<Pessoa> {
    // O Prisma permite criar relacionamentos aninhados (Nested Writes)
    return await prisma.pessoa.create({
      data: {
        // 1. Dados Básicos
        cpf: data.cpf,
        nome: data.nome,
        email: data.email,
        password: data.password,
        dataNascimento: data.dataNascimento,
        sexo: data.sexo,
        endereco: data.endereco,
        telefone: data.telefone,

        // 2. Se tiver dados de PACIENTE, cria o registro na tabela Paciente
        paciente: data.paciente ? {
          create: {
            convenioId: data.paciente.convenioId
          }
        } : undefined,

        // 3. Se tiver dados de FUNCIONÁRIO, cria o registro na tabela Funcionario
        funcionario: data.funcionario ? {
          create: {
            dataAdmissao: data.funcionario.dataAdmissao,
            salario: data.funcionario.salario,
            cargo: data.funcionario.cargo,
            crm: data.funcionario.crm,
            coren: data.funcionario.coren,
            // Conecta as especialidades (se houver)
            especialidades: data.funcionario.especialidadeIds ? {
              connect: data.funcionario.especialidadeIds.map(id => ({ id }))
            } : undefined
          }
        } : undefined
      },
      // Inclui os dados criados na resposta para conferência
      include: {
        paciente: true,
        funcionario: true
      }
    
    });
    
  }
  async findAll(): Promise<Pessoa[]> {
    return await prisma.pessoa.findMany({
      include: {
        paciente: true,     // Traz os dados de paciente junto
        funcionario: true,  // Traz os dados de funcionário junto
      }
    });
}
}
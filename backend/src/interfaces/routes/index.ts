import { Router } from 'express';
import { pessoaRoutes } from './pessoa.routes'; 
import { authRoutes } from './auth.route';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const routes = Router();
const prisma = new PrismaClient();

routes.get('/', (req, res) => {
  return res.json({ message: 'IESI Hospital Backend ON! 🏥' });
});

// Endpoint temporário para criar/atualizar usuário de teste
routes.post('/create-test-user', async (req, res) => {
  try {
    const email = 'user@example.com';
    const password = 'user123';
    const cpf = '12345678900';
    const nome = 'Usuario Teste';

    // Verifica se o usuário já existe por email
    const existingUserByEmail = await prisma.pessoa.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      // Atualiza a senha para user123
      const passwordHash = await hash(password, 8);
      const updated = await prisma.pessoa.update({
        where: { email },
        data: { password: passwordHash }
      });
      return res.json({ 
        message: 'Senha resetada para user123!', 
        email: updated.email,
        id: updated.id
      });
    }

    // Verifica se o CPF já existe
    const existingUserByCpf = await prisma.pessoa.findUnique({
      where: { cpf }
    });

    if (existingUserByCpf) {
      // Se o CPF existe mas o email é diferente, atualiza o email e senha
      const passwordHash = await hash(password, 8);
      const updated = await prisma.pessoa.update({
        where: { cpf },
        data: { email, password: passwordHash }
      });
      return res.json({ 
        message: 'Usuario atualizado com novo email e senha resetada!', 
        email: updated.email,
        id: updated.id
      });
    }

    // Hash da senha
    const passwordHash = await hash(password, 8);

    // Cria o usuário
    const pessoa = await prisma.pessoa.create({
      data: {
        cpf,
        nome,
        email,
        password: passwordHash,
        dataNascimento: new Date('1990-01-01'),
        sexo: 'M',
        endereco: 'Endereco de teste',
        telefone: '11999999999',
      }
    });

    return res.json({ 
      message: 'Usuario criado com sucesso!',
      email,
      password,
      id: pessoa.id
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Agora a rota principal é /pessoas
routes.use('/pessoas', pessoaRoutes);
routes.use('/',authRoutes);

export { routes };
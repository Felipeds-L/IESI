const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'user@example.com';
  const password = 'user123';
  const cpf = '12345678900';
  const nome = 'Usuario Teste';

  try {
    // Verifica se o usuário já existe
    const existingUser = await prisma.pessoa.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('Usuario ja existe!');
      return;
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

    console.log('Usuario criado com sucesso!');
    console.log('Email:', email);
    console.log('Senha:', password);
    console.log('ID:', pessoa.id);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();


// Define a entidade User Pura, sem acoplamento com o Prisma
export type UserEntity = {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
}

// Define os dados necessários para CRIAR um usuário
export type CreateUserData = {
  email: string;
  name: string | null;
}

// Esta é a INTERFACE (o contrato) que o Use Case vai usar.
// Note que não há NENHUMA menção ao Prisma aqui.
export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  listAll(): Promise<UserEntity[]>;
}
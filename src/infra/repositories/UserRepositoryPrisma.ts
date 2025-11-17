// src/infra/repositories/UserRepositoryPrisma.ts
import { IUserRepository, UserEntity, CreateUserData } from '../../domain/repositories/IUserRepository';
import { prisma } from '../database/prisma/client';

// Esta classe IMPLEMENTA a interface IUserRepository
// usando o Prisma. É o único lugar que "sabe" sobre o Prisma.
export class UserRepositoryPrisma implements IUserRepository {
  
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user; // O tipo do Prisma já é compatível com nossa UserEntity
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
    return user;
  }

  async listAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany();
    return users;
  }
}
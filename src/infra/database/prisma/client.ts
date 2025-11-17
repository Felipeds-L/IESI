// src/infra/database/prisma/client.ts
import { PrismaClient } from '@prisma/client';

// Cria uma instância única do Prisma Client para ser usada em toda a aplicação
export const prisma = new PrismaClient();
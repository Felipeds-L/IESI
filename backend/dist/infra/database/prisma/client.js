"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/infra/database/prisma/client.ts
const client_1 = require("@prisma/client");
// Cria uma instância única do Prisma Client para ser usada em toda a aplicação
exports.prisma = new client_1.PrismaClient();
//# sourceMappingURL=client.js.map
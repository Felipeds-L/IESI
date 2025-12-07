import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  // Engine antiga (opcional, mas válido)
  engine: "classic",

  // 🔥 AQUI está a parte corrigida
  datasource: {
    url: env("DATABASE_URL"),
  },
});

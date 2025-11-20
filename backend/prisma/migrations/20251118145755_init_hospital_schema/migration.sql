/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('ADMINISTRATIVO', 'MEDICO', 'ENFERMEIRO');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "sexo" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "convenioId" INTEGER,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL,
    "salario" DOUBLE PRECISION,
    "cargo" "Cargo" NOT NULL,
    "crm" TEXT,
    "coren" TEXT,
    "supervisorId" INTEGER,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Convenio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Convenio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsaveisPaciente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "parentesco" TEXT,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "ResponsaveisPaciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "custo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Procedimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" SERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "custo" DOUBLE PRECISION NOT NULL,
    "pagador" TEXT NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "procedimentoId" INTEGER NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MedicoEspecialidades" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MedicoEspecialidades_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_pessoaId_key" ON "Paciente"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_pessoaId_key" ON "Funcionario"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Convenio_nome_key" ON "Convenio"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Procedimento_nome_key" ON "Procedimento"("nome");

-- CreateIndex
CREATE INDEX "_MedicoEspecialidades_B_index" ON "_MedicoEspecialidades"("B");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_convenioId_fkey" FOREIGN KEY ("convenioId") REFERENCES "Convenio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Funcionario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsaveisPaciente" ADD CONSTRAINT "ResponsaveisPaciente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicoEspecialidades" ADD CONSTRAINT "_MedicoEspecialidades_A_fkey" FOREIGN KEY ("A") REFERENCES "Especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicoEspecialidades" ADD CONSTRAINT "_MedicoEspecialidades_B_fkey" FOREIGN KEY ("B") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

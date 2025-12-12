import { Router } from "express";
import { prisma } from "../../infra/database/prisma/client";
import { hash } from "bcryptjs";

const medicoRoutes = Router();

// Listar médicos
medicoRoutes.get("/", async (req, res) => {
  try {
    const medicos = await prisma.pessoa.findMany({
      where: {
        funcionario: {
          cargo: "MEDICO",
        },
      },
      include: {
        funcionario: true,
      },
    });

    const medicosFormatados = medicos.map((pessoa) => ({
      id: pessoa.funcionario?.id,
      pessoaId: pessoa.id,
      nome: pessoa.nome,
      cpf: pessoa.funcionario?.cpf,
      crm: pessoa.funcionario?.crm,
      cargo: pessoa.funcionario?.cargo,
      especialidade: pessoa.funcionario?.especialidade,
    }));

    return res.json(medicosFormatados);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Criar médico
medicoRoutes.post("/", async (req, res) => {
  try {
    const { nome, cpf, crm, password, especialidade } = req.body;

    if (!nome || !cpf || !crm || !password) {
      return res.status(400).json({ error: "Nome, CPF, CRM e senha são obrigatórios" });
    }

    const cpfLimpo = cpf.replace(/[^\d]+/g, "");
    if (cpfLimpo.length !== 11) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    // Verifica se já existe
    const existe = await prisma.funcionario.findUnique({
      where: { cpf: cpfLimpo },
    });

    if (existe) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    // Criptografa senha
    const passwordHash = await hash(password, 8);

    // Cria pessoa e funcionário
    const pessoa = await prisma.pessoa.create({
      data: {
        nome,
        funcionario: {
          create: {
            cpf: cpfLimpo,
            password: passwordHash,
            cargo: "MEDICO",
            crm: crm,
            especialidade: especialidade || null,
          },
        },
      },
      include: {
        funcionario: true,
      },
    });

    return res.status(201).json({
      id: pessoa.funcionario?.id,
      pessoaId: pessoa.id,
      nome: pessoa.nome,
      cpf: pessoa.funcionario?.cpf,
      crm: pessoa.funcionario?.crm,
      especialidade: pessoa.funcionario?.especialidade,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Atualizar médico
medicoRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, crm, password, especialidade } = req.body;

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: Number(id) },
      include: { pessoa: true },
    });

    if (!funcionario || funcionario.cargo !== "MEDICO") {
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    // Se CPF foi fornecido, valida e verifica se já existe
    if (cpf) {
      const cpfLimpo = cpf.replace(/[^\d]+/g, "");
      if (cpfLimpo.length !== 11) {
        return res.status(400).json({ error: "CPF inválido" });
      }
      
      // Verifica se o CPF já existe em outro funcionário
      const cpfExistente = await prisma.funcionario.findUnique({
        where: { cpf: cpfLimpo },
      });
      
      if (cpfExistente && cpfExistente.id !== Number(id)) {
        return res.status(400).json({ error: "CPF já cadastrado para outro médico" });
      }
    }

    const updateData: any = {};
    const funcionarioUpdate: any = {};
    
    if (nome) updateData.nome = nome;
    if (cpf) {
      const cpfLimpo = cpf.replace(/[^\d]+/g, "");
      funcionarioUpdate.cpf = cpfLimpo;
    }
    if (crm) funcionarioUpdate.crm = crm;
    if (especialidade !== undefined) funcionarioUpdate.especialidade = especialidade || null;
    if (password) {
      const passwordHash = await hash(password, 8);
      funcionarioUpdate.password = passwordHash;
    }
    
    if (Object.keys(funcionarioUpdate).length > 0) {
      updateData.funcionario = { update: funcionarioUpdate };
    }

    const pessoa = await prisma.pessoa.update({
      where: { id: funcionario.pessoaId },
      data: updateData,
      include: { funcionario: true },
    });

    return res.json({
      id: pessoa.funcionario?.id,
      pessoaId: pessoa.id,
      nome: pessoa.nome,
      cpf: pessoa.funcionario?.cpf,
      crm: pessoa.funcionario?.crm,
      especialidade: pessoa.funcionario?.especialidade,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Deletar médico
medicoRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const funcionarioId = Number(id);

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId },
    });

    if (!funcionario || funcionario.cargo !== "MEDICO") {
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    
    await prisma.$transaction(async (tx) => {
      // 1. Deleta agendamentos vinculados ao médico
      await tx.agendamento.deleteMany({
        where: { funcionarioId: funcionarioId }
      });

      // 2. Deleta o registro de funcionário
      await tx.funcionario.delete({
        where: { id: funcionarioId },
      });

      // 3. Deleta o registro de pessoa (dados básicos)
      await tx.pessoa.delete({
        where: { id: funcionario.pessoaId },
      });
    });

    return res.json({ message: "Médico deletado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar médico:", error);
    return res.status(400).json({ error: "Erro ao deletar médico. Verifique se existem dependências." });
  }
});

export { medicoRoutes };


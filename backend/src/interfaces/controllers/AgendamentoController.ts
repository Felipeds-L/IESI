// src/interfaces/controllers/AgendamentoController.ts

import { Request, Response } from "express";
import { CreateAgendamentoUseCase } from "../../domain/usecases/CreateAgendamentoUseCase";
import { AgendamentoRepositoryPrisma } from "../../infra/repositories/AgendamentoRepositoryPrisma";

export class AgendamentoController {
  constructor(
    private createAgendamentoUseCase: CreateAgendamentoUseCase,
    private agendamentoRepository: AgendamentoRepositoryPrisma
  ) {}

  async create(req: Request, res: Response) {
    const data = req.body;
    console.log("[BACKEND] POST /agendamentos - Dados recebidos:", JSON.stringify(data, null, 2));

    if (data.dataHora) {
      const dateObj = new Date(data.dataHora);
      if (isNaN(dateObj.getTime())) {
        console.error("[BACKEND] Data inválida recebida:", data.dataHora);
        return res.status(400).json({ error: "Data/hora inválida. Formato esperado: YYYY-MM-DDTHH:mm:ss.sssZ" });
      }
      data.dataHora = dateObj;
      console.log("[BACKEND] dataHora convertida para Date:", data.dataHora);
    }

    try {
      const agendamento = await this.createAgendamentoUseCase.execute(data);
      console.log("[BACKEND] Agendamento criado com sucesso:", JSON.stringify(agendamento, null, 2));
      return res.status(201).json(agendamento);
    } catch (error: any) {
      console.error("[BACKEND] Erro ao criar agendamento:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  // 🟢 GET /agendamentos
  async getAll(req: Request, res: Response) {
    try {
      const funcionarioId = req.query.funcionarioId as string;
      console.log("[BACKEND] GET /agendamentos - funcionarioId:", funcionarioId);
      const agendamentos = await this.agendamentoRepository.findAll(funcionarioId ? Number(funcionarioId) : undefined);
      console.log("[BACKEND] Agendamentos encontrados:", agendamentos.length);
      console.log("[BACKEND] Primeiro agendamento (se houver):", agendamentos[0] ? JSON.stringify(agendamentos[0], null, 2) : "Nenhum");
      return res.json(agendamentos);
    } catch (error: any) {
      console.error("[BACKEND] Erro ao buscar agendamentos:", error);
      return res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  }
}

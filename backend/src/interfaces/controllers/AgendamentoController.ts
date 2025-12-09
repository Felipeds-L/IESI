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

    if (data.dataHora) {
      data.dataHora = new Date(data.dataHora);
    }

    try {
      const agendamento = await this.createAgendamentoUseCase.execute(data);
      return res.status(201).json(agendamento);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // 🟢 GET /agendamentos
  async getAll(req: Request, res: Response) {
    try {
      const agendamentos = await this.agendamentoRepository.findAll();
      return res.json(agendamentos);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  }
}

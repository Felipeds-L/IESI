// src/interfaces/controllers/AgendamentoController.ts

import { Request, Response } from "express";
import { CreateAgendamentoUseCase } from "../../domain/usecases/CreateAgendamentoUseCase";

export class AgendamentoController {
  constructor(private createAgendamentoUseCase: CreateAgendamentoUseCase) {}

  async create(req: Request, res: Response) {
    const data = req.body;

    // Converte a data para Date()
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
}

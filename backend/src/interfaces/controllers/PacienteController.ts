import { Request, Response } from "express";
import { CreatePacienteUseCase } from "../../domain/usecases/CreatePacienteUseCase";
import { ListPacientesUseCase } from "../../domain/usecases/ListPacientesUseCase";
import { PacienteRepositoryPrisma } from "../../infra/repositories/PacienteRepositoryPrisma";

export class PacienteController {
  constructor(
    private createPacienteUseCase: CreatePacienteUseCase,
    private listPacientesUseCase: ListPacientesUseCase
  ) {}

  async create(req: Request, res: Response) {
    const data = req.body;
    console.log("[BACKEND] Recebida requisição para criar paciente");
    console.log("[BACKEND] Dados recebidos:", JSON.stringify(data, null, 2));

    try {
      // Remove campos vazios ou undefined
      const cleanData: any = {
        nome: data.nome,
        cpf: data.cpf,
      };
      console.log("[BACKEND] Dados limpos iniciais:", cleanData);

      // Converte dataNascimento se fornecida e não vazia
      if (data.dataNascimento && typeof data.dataNascimento === 'string' && data.dataNascimento.trim() !== "") {
        cleanData.dataNascimento = new Date(data.dataNascimento);
        console.log("[BACKEND] Data de nascimento convertida:", cleanData.dataNascimento);
      } else if (data.dataNascimento && data.dataNascimento instanceof Date) {
        cleanData.dataNascimento = data.dataNascimento;
        console.log("[BACKEND] Data de nascimento já é Date:", cleanData.dataNascimento);
      }

      // Adiciona campos opcionais apenas se preenchidos
      if (data.sexo && data.sexo !== "") {
        cleanData.sexo = data.sexo;
        console.log("[BACKEND] Sexo adicionado:", cleanData.sexo);
      }

      if (data.responsavelNome && data.responsavelNome.trim() !== "") {
        cleanData.responsavelNome = data.responsavelNome.trim();
        console.log("[BACKEND] Responsável adicionado:", cleanData.responsavelNome);
      }

      console.log("[BACKEND] Dados finais antes do use case:", cleanData);
      console.log("[BACKEND] Chamando createPacienteUseCase.execute...");
      
      const paciente = await this.createPacienteUseCase.execute(cleanData);
      
      console.log("[BACKEND] Paciente criado com sucesso:", JSON.stringify(paciente, null, 2));
      return res.status(201).json(paciente);
    } catch (error: any) {
      console.error("[BACKEND] Erro ao criar paciente:", error);
      console.error("[BACKEND] Stack trace:", error.stack);
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const pacientes = await this.listPacientesUseCase.execute();
      return res.json(pacientes);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findByCpf(req: Request, res: Response) {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/[^\d]+/g, "");

    try {
      const pacienteRepository = new PacienteRepositoryPrisma();
      const paciente = await pacienteRepository.findByCpf(cpfLimpo);
      
      if (!paciente) {
        return res.status(404).json({ error: "Paciente não encontrado." });
      }

      return res.json(paciente);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}


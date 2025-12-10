import {
  IPacienteRepository,
  CreatePacienteDTO,
} from "../repositories/IPacienteRepository";

export class CreatePacienteUseCase {
  constructor(private pacienteRepository: IPacienteRepository) {}

  async execute(data: CreatePacienteDTO) {
    console.log("[USE_CASE] CreatePacienteUseCase.execute iniciado");
    console.log("[USE_CASE] Dados recebidos:", JSON.stringify(data, null, 2));

    // Valida Formato do CPF
    console.log("[USE_CASE] Validando formato do CPF...");
    const cpfLimpo = data.cpf.replace(/[^\d]+/g, "");
    console.log("[USE_CASE] CPF limpo:", cpfLimpo, "Tamanho:", cpfLimpo.length);
    
    if (cpfLimpo.length !== 11) {
      console.error("[USE_CASE] CPF inválido - tamanho incorreto");
      throw new Error("O CPF deve conter 11 dígitos.");
    }

    // Normaliza CPF (remove formatação)
    data.cpf = cpfLimpo;
    console.log("[USE_CASE] CPF normalizado:", data.cpf);

    // Valida se já existe
    console.log("[USE_CASE] Verificando se CPF já existe...");
    const cpfExists = await this.pacienteRepository.findByCpf(data.cpf);
    if (cpfExists) {
      console.error("[USE_CASE] CPF já cadastrado");
      throw new Error("CPF já cadastrado no sistema.");
    }
    console.log("[USE_CASE] CPF não existe, pode prosseguir");

    // Valida nome
    console.log("[USE_CASE] Validando nome...");
    if (!data.nome || data.nome.trim().length < 3) {
      console.error("[USE_CASE] Nome inválido");
      throw new Error("O nome deve ter no mínimo 3 caracteres.");
    }
    console.log("[USE_CASE] Nome válido:", data.nome);

    // Cria o paciente
    console.log("[USE_CASE] Chamando repository.create...");
    const paciente = await this.pacienteRepository.create(data);
    console.log("[USE_CASE] Paciente criado com sucesso:", JSON.stringify(paciente, null, 2));
    return paciente;
  }
}


// src/domain/usecases/CreateUserUseCase.ts
import { IUserRepository, UserEntity, CreateUserData } from '../repositories/IUserRepository';

export class CreateUserUseCase {
  
  // Injeção de Dependência: O Use Case "exige" um repositório
  // que siga o contrato IUserRepository.
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(data: CreateUserData): Promise<UserEntity> {
    
    // --- LÓGICA DE NEGÓCIO AQUI ---
    // 1. Validar se o usuário já existe
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      // Esta é a lógica de negócio!
      throw new Error('Este email já está em uso.');
    }

    // 2. Criar o usuário
    const user = await this.userRepository.create(data);

    return user;
  }
}
// src/domain/usecases/ListUsersUseCase.ts
import { IUserRepository, UserEntity } from '../repositories/IUserRepository';

export class ListUsersUseCase {
  
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(): Promise<UserEntity[]> {
    const users = await this.userRepository.listAll();
    return users;
  }
}
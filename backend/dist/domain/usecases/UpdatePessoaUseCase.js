"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePessoaUseCase = void 0;
class UpdatePessoaUseCase {
    pessoaRepository;
    constructor(pessoaRepository) {
        this.pessoaRepository = pessoaRepository;
    }
    async execute(id, data) {
        // Implementar validações e lógica de atualização conforme necessário
        const pessoa = await this.pessoaRepository.update(parseInt(id), data);
        return pessoa;
    }
}
exports.UpdatePessoaUseCase = UpdatePessoaUseCase;
//# sourceMappingURL=UpdatePessoaUseCase.js.map
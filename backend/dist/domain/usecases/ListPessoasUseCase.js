"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPessoasUseCase = void 0;
class ListPessoasUseCase {
    pessoaRepository;
    constructor(pessoaRepository) {
        this.pessoaRepository = pessoaRepository;
    }
    async execute() {
        const pessoas = await this.pessoaRepository.findAll();
        return pessoas;
    }
}
exports.ListPessoasUseCase = ListPessoasUseCase;
//# sourceMappingURL=ListPessoasUseCase.js.map
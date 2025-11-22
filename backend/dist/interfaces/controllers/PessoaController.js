"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessoaController = void 0;
class PessoaController {
    createPessoaUseCase;
    listPessoasUseCase;
    // O construtor PRECISA receber os dois UseCases
    constructor(createPessoaUseCase, listPessoasUseCase // <--- Se essa linha faltar, o erro acontece
    ) {
        this.createPessoaUseCase = createPessoaUseCase;
        this.listPessoasUseCase = listPessoasUseCase;
    }
    async create(req, res) {
        const data = req.body;
        // Conversão de datas
        if (data.dataNascimento)
            data.dataNascimento = new Date(data.dataNascimento);
        if (data.funcionario?.dataAdmissao)
            data.funcionario.dataAdmissao = new Date(data.funcionario.dataAdmissao);
        try {
            const pessoa = await this.createPessoaUseCase.execute(data);
            return res.status(201).json(pessoa);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req, res) {
        // Agora 'this.listPessoasUseCase' vai existir!
        const pessoas = await this.listPessoasUseCase.execute();
        return res.json(pessoas);
    }
}
exports.PessoaController = PessoaController;
//# sourceMappingURL=PessoaController.js.map
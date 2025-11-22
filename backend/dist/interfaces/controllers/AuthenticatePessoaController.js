"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatePessoaController = void 0;
class AuthenticatePessoaController {
    authenticatePessoaUseCase;
    constructor(authenticatePessoaUseCase) {
        this.authenticatePessoaUseCase = authenticatePessoaUseCase;
    }
    async handle(req, res) {
        const { email, password } = req.body;
        try {
            const result = await this.authenticatePessoaUseCase.execute({
                email,
                password,
            });
            return res.json(result);
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthenticatePessoaController = AuthenticatePessoaController;
//# sourceMappingURL=AuthenticatePessoaController.js.map
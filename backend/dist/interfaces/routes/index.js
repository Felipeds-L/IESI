"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const pessoa_routes_1 = require("./pessoa.routes");
const auth_route_1 = require("./auth.route");
const routes = (0, express_1.Router)();
exports.routes = routes;
/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica se a API está funcionando
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: API está funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "IESI Hospital Backend ON! 🏥"
 */
routes.get('/', (req, res) => {
    return res.json({ message: 'IESI Hospital Backend ON! 🏥' });
});
// Agora a rota principal é /pessoas
routes.use('/pessoas', pessoa_routes_1.pessoaRoutes);
routes.use('/', auth_route_1.authRoutes);
//# sourceMappingURL=index.js.map
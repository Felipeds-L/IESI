"use strict";
// src/interfaces/http/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
console.log("--- [DEBUG] 3. Carregando app.ts ---");
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const routes_1 = require("../routes");
console.log("--- [DEBUG] 4. Carregando 'routes' do app.ts ---");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
// Swagger UI - disponível em /docs e /api-docs
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use(routes_1.routes);
//# sourceMappingURL=app.js.map
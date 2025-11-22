"use strict";
// src/interfaces/http/server.ts
Object.defineProperty(exports, "__esModule", { value: true });
console.log("--- [DEBUG] 1. Carregando server.ts ---");
const app_1 = require("./app"); // <-- A LINHA MAIS IMPORTANTE
console.log("--- [DEBUG] 2. 'app' importado com sucesso ---");
const port = process.env.PORT || 3333;
app_1.app.listen(port, () => {
    console.log(`🚀 HTTP server running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map
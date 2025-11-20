// src/interfaces/http/server.ts

console.log("--- [DEBUG] 1. Carregando server.ts ---");

import { app } from './app'; // <-- A LINHA MAIS IMPORTANTE

console.log("--- [DEBUG] 2. 'app' importado com sucesso ---");

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🚀 HTTP server running on http://localhost:${port}`);
});
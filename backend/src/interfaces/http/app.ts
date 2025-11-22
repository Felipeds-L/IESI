// src/interfaces/http/app.ts

console.log("--- [DEBUG] 3. Carregando app.ts ---");

import express, { Express } from 'express';
import cors from 'cors';
import { routes } from '../routes'; 

console.log("--- [DEBUG] 4. Carregando 'routes' do app.ts ---");

const app: Express = express();

// Configuração CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(routes); 

export { app };
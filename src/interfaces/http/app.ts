// src/interfaces/http/app.ts

console.log("--- [DEBUG] 3. Carregando app.ts ---");

import express, { Express } from 'express';
import { routes } from '../routes'; 

console.log("--- [DEBUG] 4. Carregando 'routes' do app.ts ---");

const app: Express = express();

app.use(express.json());
app.use(routes); 

export { app };
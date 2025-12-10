import { Router } from "express";
import { pessoaRoutes } from "./pessoa.routes";
import { authRoutes } from "./auth.route";
import { agendamentoRoutes } from "./agendamento.routes";
import { pacienteRoutes } from "./paciente.routes";
import { medicoRoutes } from "./medico.routes";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "IESI Hospital Backend ON! 🏥" });
});

// Agora a rota principal é /pessoas
routes.use("/pessoas", pessoaRoutes);
routes.use("/pacientes", pacienteRoutes);
routes.use("/medicos", medicoRoutes);
routes.use("/agendamentos", agendamentoRoutes);
routes.use("/", authRoutes);

export { routes };

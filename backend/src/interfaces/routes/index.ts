import { Router } from "express";
import { pessoaRoutes } from "./pessoa.routes";
import { authRoutes } from "./auth.route";
import { agendamentoRoutes } from "./agendamento.routes";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "IESI Hospital Backend ON! 🏥" });
});

// Agora a rota principal é /pessoas
routes.use("/pessoas", pessoaRoutes);
routes.use("/agendamentos", agendamentoRoutes);
routes.use("/", authRoutes);

export { routes };

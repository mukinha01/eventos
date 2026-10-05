import express from "express";
import cors from "cors";
import eventoRoutes from "./routes/eventoRoutes";
import palestranteRoutes from "./routes/palestranteRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    sistema: "Gerenciador de Eventos e Palestrantes",
    status: "online"
  });
});

app.use("/eventos", eventoRoutes);
app.use("/palestrantes", palestranteRoutes);

app.use(errorHandler);

export default app;

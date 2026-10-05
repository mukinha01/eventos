import express from "express";
import cors from "cors";
import eventoRoutes from "./routes/eventoRoutes";
import palestranteRoutes from "./routes/palestranteRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import path from "node:path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), "public")));

app.get("/", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "index.html"));
});

app.use("/eventos", eventoRoutes);
app.use("/palestrantes", palestranteRoutes);

app.use(errorHandler);

export default app;

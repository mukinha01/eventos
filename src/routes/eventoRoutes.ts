import { Router } from "express";
import {
  adicionarPalestrante,
  atualizarEvento,
  buscarEvento,
  criarEvento,
  excluirEvento,
  listarEventos,
  listarPalestrantesDoEvento,
  removerPalestrante
} from "../controllers/eventoController";

const router = Router();

router.post("/", criarEvento);
router.get("/", listarEventos);
router.get("/:id", buscarEvento);
router.put("/:id", atualizarEvento);
router.delete("/:id", excluirEvento);

router.post("/:eventoId/palestrantes/:palestranteId", adicionarPalestrante);
router.get("/:eventoId/palestrantes", listarPalestrantesDoEvento);
router.delete("/:eventoId/palestrantes/:palestranteId", removerPalestrante);

export default router;

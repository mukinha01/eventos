import { Router } from "express";
import {
  atualizarPalestrante,
  buscarPalestrante,
  criarPalestrante,
  excluirPalestrante,
  listarPalestrantes
} from "../controllers/palestranteController";

const router = Router();

router.post("/", criarPalestrante);
router.get("/", listarPalestrantes);
router.get("/:id", buscarPalestrante);
router.put("/:id", atualizarPalestrante);
router.delete("/:id", excluirPalestrante);

export default router;

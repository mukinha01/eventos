import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export async function criarPalestrante(req: Request, res: Response) {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const palestrante = await prisma.palestrante.create({
    data: { nome, email }
  });

  return res.status(201).json(palestrante);
}

export async function listarPalestrantes(_req: Request, res: Response) {
  const palestrantes = await prisma.palestrante.findMany();

  return res.json(palestrantes);
}

export async function buscarPalestrante(req: Request, res: Response) {
  const id = Number(req.params.id);

  const palestrante = await prisma.palestrante.findUnique({
    where: { id }
  });

  if (!palestrante) {
    return res.status(404).json({ erro: "Palestrante nao encontrado." });
  }

  return res.json(palestrante);
}

export async function atualizarPalestrante(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const palestrante = await prisma.palestrante.update({
    where: { id },
    data: { nome, email }
  });

  return res.json(palestrante);
}

export async function excluirPalestrante(req: Request, res: Response) {
  const id = Number(req.params.id);

  await prisma.palestrante.delete({
    where: { id }
  });

  return res.status(204).send();
}

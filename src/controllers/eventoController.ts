import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export async function criarEvento(req: Request, res: Response) {
  const { nome, descricao, local } = req.body;

  if (!nome || !descricao || !local) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const evento = await prisma.evento.create({
    data: { nome, descricao, local }
  });

  return res.status(201).json(evento);
}

export async function listarEventos(_req: Request, res: Response) {
  const eventos = await prisma.evento.findMany({
    include: {
      palestrantes: {
        include: {
          palestrante: true
        }
      }
    }
  });

  return res.json(eventos);
}

export async function buscarEvento(req: Request, res: Response) {
  const id = Number(req.params.id);

  const evento = await prisma.evento.findUnique({
    where: { id },
    include: {
      palestrantes: {
        include: {
          palestrante: true
        }
      }
    }
  });

  if (!evento) {
    return res.status(404).json({ erro: "Evento nao encontrado." });
  }

  return res.json(evento);
}

export async function atualizarEvento(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome, descricao, local } = req.body;

  if (!nome || !descricao || !local) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const evento = await prisma.evento.update({
    where: { id },
    data: { nome, descricao, local }
  });

  return res.json(evento);
}

export async function excluirEvento(req: Request, res: Response) {
  const id = Number(req.params.id);

  await prisma.evento.delete({
    where: { id }
  });

  return res.status(204).send();
}

export async function adicionarPalestrante(req: Request, res: Response) {
  const eventoId = Number(req.params.eventoId);
  const palestranteId = Number(req.params.palestranteId);

  const vinculo = await prisma.eventoPalestrante.create({
    data: { eventoId, palestranteId }
  });

  return res.status(201).json(vinculo);
}

export async function listarPalestrantesDoEvento(req: Request, res: Response) {
  const eventoId = Number(req.params.eventoId);

  const palestrantes = await prisma.eventoPalestrante.findMany({
    where: { eventoId },
    include: {
      palestrante: true
    }
  });

  return res.json(palestrantes);
}

export async function removerPalestrante(req: Request, res: Response) {
  const eventoId = Number(req.params.eventoId);
  const palestranteId = Number(req.params.palestranteId);

  await prisma.eventoPalestrante.delete({
    where: {
      eventoId_palestranteId: {
        eventoId,
        palestranteId
      }
    }
  });

  return res.status(204).send();
}

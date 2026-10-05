import { Request, Response, NextFunction } from "express";

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }

  return typeof error.code === "string" ? error.code : undefined;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const code = getErrorCode(error);

  if (code === "P2002") {
    return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
  }
  if (code === "P2003") {
    return res.status(400).json({ erro: "Um dos palestrantes selecionados não foi encontrado." });
  }
  if (code === "P2025") {
    return res.status(404).json({ erro: "Registro não encontrado." });
  }

  if (code === "P1000" || (error instanceof Error && /authentication failed/i.test(error.message))) {
    return res.status(503).json({
      erro: "Falha na autenticação do PostgreSQL. Confira usuário e senha em DATABASE_URL no arquivo .env."
    });
  }

  if (code === "P1001") {
    return res.status(503).json({
      erro: "Não foi possível alcançar o PostgreSQL. Confira se o serviço está ativo e se host e porta estão corretos."
    });
  }

  if (code === "P1003") {
    return res.status(503).json({
      erro: "O banco de dados configurado não existe. Confira o nome do banco em DATABASE_URL."
    });
  }

  if (code === "P2021" || code === "P2022") {
    return res.status(503).json({
      erro: "O banco foi conectado, mas a estrutura está incompleta. Confira se as tabelas e colunas do projeto foram criadas."
    });
  }

  const errorName = error instanceof Error ? error.name : "UnknownError";
  console.error("Erro não tratado na API:", { name: errorName, code });

  return res.status(500).json({
    erro: "Erro interno no servidor. Consulte o log da API para mais detalhes."
  });
}

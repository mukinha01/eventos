import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log(error);

  return res.status(500).json({
    erro: "Erro no servidor."
  });
}

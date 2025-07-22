import { Request, Response } from "express";
import { renderSuccessView } from "../utils/viewRenderer";

export function getSuccessView(entity: string, action: string) {
  return async function (_: Request, res: Response) {
    await renderSuccessView(res, { entity, action });
  };
}

import { Request, Response } from "express";
import { checkPassword } from "../utils/password-utils";
import { deleteGenreById } from "../db/queries";
import { renderSuccessView } from "../utils/viewRenderer";

export async function postGenreDelete(req: Request, res: Response) {
  const genreId = Number(req.params.genreId);

  if (isNaN(genreId)) {
    res.status(400).send({ error: "Invalid genre ID" });
    return;
  }

  try {
    const isAuthorized = await checkPassword(req.body.secret_password);
    if (!isAuthorized) {
      res.status(400).send({ error: "Invalid password" });
      return;
    }

    const isDeleted = await deleteGenreById(genreId);
    if (!isDeleted) {
      res.status(404).send({ error: "Genre not found" });
      return;
    }

    res.status(200).send({ message: "Genre deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch genre data",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function getGenreDeleteSuccessView(_: Request, res: Response) {
  await renderSuccessView(res, { entity: "genre", action: "deleted" });
}

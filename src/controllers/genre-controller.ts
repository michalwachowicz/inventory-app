import { Request, Response } from "express";
import { checkPassword } from "../utils/password-utils";
import { deleteGenreById, getGenreNameById } from "../db/queries";
import { renderSuccessView, renderView } from "../utils/viewRenderer";
import { Genre } from "../types/genre";
import { EntityFormRenderOptions } from "../types/render-options";
import { capitalize } from "../utils/capitalize";

async function renderGenreForm(
  res: Response,
  options: {
    action: "add" | "edit";
    genre?: Genre;
    errors?: Record<string, string>;
  },
) {
  const { action, genre, errors } = options;

  renderView<EntityFormRenderOptions>(res, {
    viewName: "entity-form",
    title: `${capitalize(action)} Genre`,
    navbar: "basic",
    entityName: "genre",
    entity: genre,
    action,
    errors,
  });
}

export async function getGenreEditForm(req: Request, res: Response) {
  const genreId = Number(req.params.genreId);

  if (isNaN(genreId)) {
    res.status(400).send("Invalid genre ID");
    return;
  }

  const genreName = await getGenreNameById(genreId);
  if (genreName === null) {
    res.status(404).send("Genre not found");
    return;
  }

  await renderGenreForm(res, {
    action: "edit",
    genre: { id: genreId, name: genreName },
  });
}

export async function getGenreAddForm(_: Request, res: Response) {
  await renderGenreForm(res, { action: "add" });
}

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

export async function getGenreAddSuccessView(_: Request, res: Response) {
  await renderSuccessView(res, { entity: "genre", action: "added" });
}

export async function getGenreEditSuccessView(_: Request, res: Response) {
  await renderSuccessView(res, { entity: "genre", action: "edited" });
}

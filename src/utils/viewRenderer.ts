import { Response } from "express";
import { Genre } from "../types/genre";
import { getGenres } from "../db/queries";
import { RenderOptions } from "../types/render-options";

export async function renderView<T extends RenderOptions = RenderOptions>(
  res: Response,
  options: T,
) {
  const genres: Genre[] = options.navbar === "full" ? await getGenres() : [];
  res.render("index", { ...options, genres });
}

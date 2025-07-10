import { Response } from "express";
import { Genre } from "../types/genre";
import { getGenres } from "../db/queries";
import { Book } from "../types/book";

interface RenderOptions {
  viewName: string;
  title?: string;
  navbar?: "basic" | "full";
  results?: Book[];
}

export async function renderView(res: Response, options: RenderOptions) {
  const genres: Genre[] = options.navbar === "full" ? await getGenres() : [];
  res.render("index", { ...options, genres });
}

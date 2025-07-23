import { Request, Response } from "express";
import { renderView } from "../utils/view-renderer";
import { QueryRenderOptions } from "../types/render-options";
import { buildBaseQueryString } from "../utils/base-query";
import { getBooksByGenreAndQuery, getGenreById } from "../db/queries";
import { Entity } from "../types/entity";

export async function getResults(req: Request, res: Response) {
  const query = (req.query.query as string) || undefined;
  const genreId = Number(req.query.genreId) || undefined;

  let page = Number(req.query.currentPage) || 1;
  let selectedGenre: Entity | undefined;

  if (genreId) {
    const genre = await getGenreById(genreId);
    if (genre) selectedGenre = genre;
  }

  const { books: results, pages } = await getBooksByGenreAndQuery({
    query,
    page,
    genreId,
  });

  const pageTitle = query ? `Search "${query}"` : undefined;
  if (page > pages) page = pages;

  await renderView<QueryRenderOptions>(res, {
    title: pageTitle || "Results",
    viewName: "results",
    navbar: "full",
    query,
    pageTitle,
    pages,
    results,
    currentPage: page,
    selectedGenre,
    baseQueryString: buildBaseQueryString(
      req,
      req.query.genreId ? ["currentPage"] : ["currentPage", "genreId"],
    ),
  });
}

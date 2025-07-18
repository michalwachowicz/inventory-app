import { Request, Response } from "express";
import { renderView } from "../utils/viewRenderer";
import { QueryRenderOptions } from "../types/render-options";
import { buildBaseQueryString } from "../utils/base-query";
import { getBooksByGenreAndQuery, getGenreNameById } from "../db/queries";
import { Genre } from "../types/genre";

export async function getResults(req: Request, res: Response) {
  const query = (req.query.query as string) || undefined;
  const genreId = Number(req.query.genreId) || undefined;

  let page = Number(req.query.currentPage) || 1;
  let selectedGenre: Genre | undefined;

  if (genreId) {
    const genreName = await getGenreNameById(genreId);
    if (genreName) selectedGenre = { id: genreId, name: genreName };
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
    baseQueryString: buildBaseQueryString(req),
  });
}

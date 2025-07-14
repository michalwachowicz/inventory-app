import { Request, Response } from "express";
import { renderView } from "../utils/viewRenderer";
import { QueryRenderOptions } from "../types/render-options";
import { buildBaseQueryString } from "../utils/base-query";
import { getBooksByGenreAndQuery } from "../db/queries";

export async function getResults(req: Request, res: Response) {
  const query = (req.query.query as string) || undefined;
  let page = Number(req.query.currentPage) || 1;

  const { books: results, pages } = await getBooksByGenreAndQuery({
    query,
    page,
    genreId: Number(req.query.genreId) || undefined,
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
    baseQueryString: buildBaseQueryString(req),
  });
}

import { Request, Response } from "express";
import { getAuthorById, getBooksByAuthor } from "../db/queries";
import { renderView } from "../utils/viewRenderer";
import { ResultsRenderOptions } from "../types/render-options";
import { buildBaseQueryString } from "../utils/base-query";

export async function getAuthorBooks(req: Request, res: Response) {
  const authorId = Number(req.params.authorId);

  // TODO: Render error page
  if (isNaN(authorId)) {
    res.status(400).json({ error: "Invalid author ID" });
    return;
  }

  const author = await getAuthorById(authorId);

  // TODO: Render author not found page
  if (!author) {
    res.status(404).json({ error: "Author not found" });
    return;
  }

  const currentPage = req.query.page ? Number(req.query.page) : 1;
  const { books: results, pages } = await getBooksByAuthor(
    authorId,
    currentPage,
  );

  const pageTitle = `Author: ${author.name}`;

  renderView<ResultsRenderOptions>(res, {
    viewName: "results",
    navbar: "basic",
    title: pageTitle,
    pageTitle,
    results,
    pages,
    currentPage,
    baseQueryString: buildBaseQueryString(req),
  });
}

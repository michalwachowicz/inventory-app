import { Request, Response } from "express";
import { getAuthorById, getBooksByAuthor } from "../db/queries";
import { renderView } from "../utils/viewRenderer";
import {
  ErrorRenderOptions,
  ResultsRenderOptions,
} from "../types/render-options";
import { buildBaseQueryString } from "../utils/base-query";

export async function getAuthorBooks(req: Request, res: Response) {
  const authorId = Number(req.params.authorId);

  if (isNaN(authorId)) {
    renderView<ErrorRenderOptions>(res, {
      viewName: "error",
      title: "Invalid Author ID",
      navbar: "basic",
      errorMessage: "Author ID must be a number.",
    });
    return;
  }

  const author = await getAuthorById(authorId);

  if (!author) {
    renderView<ErrorRenderOptions>(res, {
      viewName: "error",
      title: "Author Not Found",
      navbar: "basic",
      errorMessage: `Author with ID ${authorId} was not found.`,
    });
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

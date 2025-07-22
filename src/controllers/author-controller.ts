import { Request, Response } from "express";
import {
  deleteAuthorById,
  getAuthorById,
  getBooksByAuthor,
} from "../db/queries";
import { renderSuccessView, renderView } from "../utils/viewRenderer";
import {
  AuthorRenderOptions,
  ErrorRenderOptions,
} from "../types/render-options";
import { buildBaseQueryString } from "../utils/base-query";
import { checkPassword } from "../utils/password-utils";

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

  renderView<AuthorRenderOptions>(res, {
    viewName: "results",
    navbar: "basic",
    title: pageTitle,
    pageTitle,
    results,
    pages,
    currentPage,
    authorId,
    baseQueryString: buildBaseQueryString(req),
  });
}

export async function postAuthorDelete(req: Request, res: Response) {
  const authorId = Number(req.params.authorId);

  if (isNaN(authorId)) {
    res.status(400).send({ error: "Invalid author ID" });
    return;
  }

  try {
    const isAuthorized = await checkPassword(req.body.secret_password);
    if (!isAuthorized) {
      res.status(400).send({ error: "Invalid password" });
      return;
    }

    const isDeleted = await deleteAuthorById(authorId);
    if (!isDeleted) {
      res.status(404).send({ error: "Author not found" });
      return;
    }

    res.status(200).send({ message: "Author deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch author data",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function getAuthorDeleteSuccessView(_: Request, res: Response) {
  await renderSuccessView(res, { entity: "author", action: "deleted" });
}

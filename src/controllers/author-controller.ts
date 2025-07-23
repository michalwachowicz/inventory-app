import { Request, Response } from "express";
import {
  deleteAuthorById,
  getAuthorById,
  getBooksByAuthor,
} from "../db/queries";
import { renderErrorView, renderView } from "../utils/view-renderer";
import { AuthorRenderOptions } from "../types/render-options";
import { buildBaseQueryString } from "../utils/base-query";
import {
  getEntityDeleteMethod,
  getEntityPostForm,
  getEntityPostMethod,
} from "./entity-controller";

function getAuthorPostMethod(action: "add" | "edit") {
  return getEntityPostMethod({ action, entityName: "author" });
}

export function getAuthorEditForm() {
  return getEntityPostForm("author", getAuthorById);
}

export function postAuthorDelete() {
  return getEntityDeleteMethod("author", deleteAuthorById);
}

export function postAuthorAdd() {
  return getAuthorPostMethod("add");
}

export function postAuthorEdit() {
  return getAuthorPostMethod("edit");
}

export async function getAuthorBooks(req: Request, res: Response) {
  const authorId = Number(req.params.authorId);

  if (isNaN(authorId)) {
    renderErrorView(res, {
      title: "Invalid Author ID",
      errorMessage: "Author ID must be a number.",
    });
    return;
  }

  const author = await getAuthorById(authorId);

  if (!author) {
    renderErrorView(res, {
      title: "Author Not Found",
      errorMessage: `Author with ID ${authorId} was not found.`,
    });
    return;
  }

  const currentPage = req.query.currentPage ? Number(req.query.currentPage) : 1;
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

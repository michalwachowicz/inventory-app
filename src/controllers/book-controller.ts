import { Request, Response } from "express";
import { renderView } from "../utils/viewRenderer";
import { BookFormRenderOptions } from "../types/render-options";
import { getAuthors, getBookById, getGenres } from "../db/queries";

export async function getBookEditForm(req: Request, res: Response) {
  const bookId = Number(req.params.bookId);

  if (isNaN(bookId)) {
    res.status(400).send("Invalid book ID");
    return;
  }

  const book = await getBookById(bookId);
  if (book === null) {
    res.status(404).send("Book not found");
    return;
  }

  const authors = await getAuthors();
  const genres = await getGenres();

  renderView<BookFormRenderOptions>(res, {
    viewName: "book-form",
    title: "Edit Book",
    navbar: "basic",
    action: "edit",
    authors,
    genres,
    book,
  });
}

export async function getBookAddForm(_: Request, res: Response) {
  const authors = await getAuthors();
  const genres = await getGenres();

  renderView<BookFormRenderOptions>(res, {
    viewName: "book-form",
    title: "Add Book",
    navbar: "basic",
    action: "add",
    authors,
    genres,
  });
}

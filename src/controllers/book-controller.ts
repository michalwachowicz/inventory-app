import { Request, Response } from "express";
import { renderView } from "../utils/viewRenderer";
import { BookFormRenderOptions } from "../types/render-options";
import {
  getAuthorByName,
  getAuthors,
  getBookById,
  getGenres,
} from "../db/queries";
import { BookResponse } from "../types/book";

export async function fetchBookData(req: Request, res: Response) {
  const isbn = req.params.isbn;

  try {
    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
    );
    const data = await response.json();
    const extractedData = data[`ISBN:${isbn}`];

    const author = await getAuthorByName(
      extractedData?.authors?.[0]?.name || "undefined",
    );

    const bookData: BookResponse = {
      title: extractedData?.title || "",
      author_id: author?.id || -1,
      cover: extractedData?.cover?.medium || "",
      publication_year: extractedData?.publish_date.split(", ")[1] || -1,
      pages: extractedData?.number_of_pages || -1,
    };

    res.json(bookData);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch book data",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

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

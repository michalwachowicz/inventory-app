import { Request, Response } from "express";
import {
  renderInvalidIdErrorView,
  renderServerErrorView,
  renderView,
} from "../utils/view-renderer";
import {
  BookFormRenderOptions,
  BookRenderOptions,
} from "../types/render-options";
import {
  checkBookByISBN,
  deleteBookById,
  getAuthorByName,
  getAuthors,
  getBookById,
  getGenres,
  getMoreBooksByAuthor,
  insertBook,
  updateBook,
} from "../db/queries";
import {
  Book,
  BookFormData,
  BookFormSchema,
  BookResponse,
} from "../types/book";
import { checkPassword } from "../utils/password-utils";
import { ISBNSchema } from "../types/isbn";
import { getEntityDeleteMethod, getEntityPostForm } from "./entity-controller";
import { createZodErrorsObject } from "../utils/zod-error";

async function renderBookForm(
  res: Response,
  options: {
    action: "add" | "edit";
    book?: Book;
    errors?: Record<string, string>;
  },
) {
  const authors = await getAuthors();
  const genres = await getGenres();

  const { action, book, errors } = options;

  renderView<BookFormRenderOptions>(res, {
    viewName: "book-form",
    title: `${action[0].toUpperCase()}${action.slice(1)} Book`,
    navbar: "basic",
    action,
    authors,
    genres,
    book,
    errors,
  });
}

export async function fetchBookData(req: Request, res: Response) {
  const result = ISBNSchema.safeParse(req.params.isbn);

  if (!result.success) {
    console.error(result.error.issues[0].message);
    res.status(400).json({ error: result.error.issues[0].message });
    return;
  }

  const isbn = result.data;

  try {
    const bookExists = await checkBookByISBN(isbn);
    if (bookExists) {
      res.status(409).json({
        error: "Book with this ISBN already exists",
      });
      return;
    }

    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
    );
    const data = await response.json();
    const extractedData = data[`ISBN:${isbn}`];

    const author = await getAuthorByName(
      extractedData?.authors?.[0]?.name || "undefined",
    );

    const extractedYear: string = extractedData?.publish_date || "";
    const publication_year = Number(
      extractedYear.includes(",")
        ? extractedYear.split(", ")[1]
        : extractedYear.slice(0, 4),
    );

    const bookData: BookResponse = {
      title: extractedData?.title || "",
      author_id: author?.id || -1,
      cover: extractedData?.cover?.medium || "",
      pages: extractedData?.number_of_pages || -1,
      publication_year,
    };

    res.json(bookData);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch book data",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function getBookAddForm(_: Request, res: Response) {
  await renderBookForm(res, { action: "add" });
}

export function getBookEditForm() {
  return getEntityPostForm<Book>("book", getBookById, async (res, book) => {
    await renderBookForm(res, { action: "edit", book });
  });
}

export function postBookDelete() {
  return getEntityDeleteMethod("book", deleteBookById);
}

async function handleBookFormPost({
  req,
  res,
  action,
  onValid,
  checkDuplicate,
}: {
  req: Request;
  res: Response;
  action: "add" | "edit";
  onValid: (book: BookFormData) => Promise<void>;
  checkDuplicate: boolean;
}) {
  const result = BookFormSchema.safeParse(req.body);
  const errors = createZodErrorsObject(result);

  try {
    if (checkDuplicate && req.body.isbn) {
      const bookExists = await checkBookByISBN(req.body.isbn);
      if (bookExists) errors.isbn = "Book with this ISBN already exists";
    }

    const isAuthorized = await checkPassword(req.body.secret_password);
    if (!isAuthorized) {
      errors.secret_password = "Invalid password";
    }

    if (Object.keys(errors).length > 0) {
      await renderBookForm(res, {
        action,
        book: req.params.bookId
          ? { id: req.params.bookId, ...req.body }
          : undefined,
        errors,
      });
      return;
    }

    await onValid(result.data!);
    res.redirect(`/book/${action}/success`);
  } catch (err) {
    console.error("Unexpected error:", err);
    renderServerErrorView(res, err);
  }
}

export async function postBookAdd(req: Request, res: Response) {
  await handleBookFormPost({
    req,
    res,
    action: "add",
    onValid: insertBook,
    checkDuplicate: true,
  });
}

export async function postBookEdit(req: Request, res: Response) {
  const bookId = Number(req.params.bookId);

  if (isNaN(bookId)) {
    renderInvalidIdErrorView(res, "book");
    return;
  }

  await handleBookFormPost({
    req,
    res,
    action: "edit",
    onValid: (book) => updateBook(bookId, book),
    checkDuplicate: false,
  });
}

export async function getBook(req: Request, res: Response) {
  const bookId = Number(req.params.bookId);

  if (isNaN(bookId)) {
    renderInvalidIdErrorView(res, "book");
    return;
  }

  const book = await getBookById(bookId);

  let moreByAuthor: Book[] | undefined;
  if (book) moreByAuthor = await getMoreBooksByAuthor(book.author_id, bookId);

  await renderView<BookRenderOptions>(res, {
    viewName: "book",
    title: book?.title || "Book not found",
    navbar: "basic",
    book: book || undefined,
    moreByAuthor,
  });
}

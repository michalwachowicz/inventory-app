import { Request, Response } from "express";
import { renderView } from "../utils/viewRenderer";
import { BookFormRenderOptions } from "../types/render-options";
import {
  checkBookByISBN,
  getAuthorByName,
  getAuthors,
  getBookById,
  getGenres,
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

  await renderBookForm(res, { action: "edit", book });
}

export async function getBookAddForm(_: Request, res: Response) {
  await renderBookForm(res, { action: "add" });
}

export async function postBookAdd(req: Request, res: Response) {
  const errors: Record<string, string> = {};
  const result = BookFormSchema.safeParse(req.body);

  let book: BookFormData | null = null;

  if (!result.success) {
    for (const err of result.error.issues) {
      if (err.path.length > 0) {
        errors[err.path[0].toString()] = err.message;
      }
    }
  } else {
    book = result.data;
  }

  try {
    const bookExists = await checkBookByISBN(req.body.isbn);
    if (bookExists) errors.isbn = "Book with this ISBN already exists";

    const isAuthorized = await checkPassword(req.body.secret_password);
    if (!isAuthorized) errors.secret_password = "Invalid password";

    if (Object.keys(errors).length > 0) {
      await renderBookForm(res, { action: "add", book: req.body, errors });
      return;
    }

    await insertBook(book!);
    res.redirect("/book/success");
  } catch (err) {
    console.log("Unexpected error:", err);

    res.status(500).json({
      error: "Server error",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function postBookEdit(req: Request, res: Response) {
  const bookId = Number(req.params.bookId);

  if (isNaN(bookId)) {
    res.status(400).send("Invalid book ID");
    return;
  }

  const errors: Record<string, string> = {};
  const result = BookFormSchema.safeParse(req.body);

  let book: BookFormData | null = null;

  if (!result.success) {
    for (const err of result.error.issues) {
      if (err.path.length > 0) {
        errors[err.path[0].toString()] = err.message;
      }
    }
  } else {
    book = result.data;
  }

  try {
    const isAuthorized = await checkPassword(req.body.secret_password);
    if (!isAuthorized) errors.secret_password = "Invalid password";

    if (Object.keys(errors).length > 0) {
      await renderBookForm(res, {
        action: "edit",
        book: { id: book, ...req.body },
        errors,
      });
      return;
    }

    await updateBook(bookId, book!);
    res.redirect("/book/success");
  } catch (err) {
    console.log("Unexpected error:", err);

    res.status(500).json({
      error: "Server error",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

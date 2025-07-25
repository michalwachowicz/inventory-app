import {
  cacheBooksByEntity,
  cacheRecentlyAddedBooks,
  getCachedBookById,
  getCachedBooksByEntity,
  getCachedPagesByEntity,
  getCachedRecentlyAddedBooks,
  invalidateCachedBooks,
} from "../cache/book-cache";
import {
  cacheEntity,
  CacheKey,
  deleteCachedEntity,
  getCachedEntity,
  getCachedEntityList,
  isCacheEntityKey,
  updateCachedEntityList,
} from "../cache/entity-cache";
import {
  getCachedPassword,
  updateCachedPassword,
} from "../cache/password-cache";
import { Book, BookFormData } from "../types/book";
import { Entity } from "../types/entity";
import pool from "./pool";

const PAGE_LIMIT = 6;

async function createAuthorsTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
  )`);
}

async function createGenresTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
  )`);
}

async function createBooksTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    isbn VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    cover VARCHAR(255) NOT NULL,
    description TEXT,
    publication_year INTEGER NOT NULL,
    pages INTEGER NOT NULL,
    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE
  )`);
}

async function createSecretPasswordTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS secret_password (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    password TEXT NOT NULL
  )`);
}

export async function initDatabase() {
  await createAuthorsTable();
  await createGenresTable();
  await createBooksTable();
  await createSecretPasswordTable();
}

export async function getEntities(key: CacheKey): Promise<Entity[]> {
  const cachedGenres = getCachedEntityList(key);
  if (cachedGenres.length > 0) return cachedGenres;

  const { rows } = await pool.query(`SELECT * FROM ${key}`);
  updateCachedEntityList(key, rows);

  return rows;
}

export function getEntityById(key: CacheKey) {
  return async function (id: number) {
    const cachedEntity = getCachedEntity(key, id);
    if (cachedEntity) return cachedEntity;

    const { rows } = await pool.query(`SELECT * FROM ${key} WHERE id = $1`, [
      id,
    ]);

    if (rows.length === 0) return null;

    const entity: Entity = rows[0];
    cacheEntity(key, entity);

    return entity;
  };
}

export function deleteEntityById(table: string) {
  return async function (id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
      [id],
    );

    if (isCacheEntityKey(table)) deleteCachedEntity(table, id);

    return (result.rowCount ?? 0) > 0;
  };
}

export function updateEntity(key: CacheKey) {
  return async function (id: number, name: string) {
    await pool.query(`UPDATE ${key} SET name = $1 WHERE id = $2`, [name, id]);
    cacheEntity(key, { id, name });
  };
}

export function insertEntity(key: CacheKey) {
  return async function (name: string) {
    const { rows } = await pool.query(
      `INSERT INTO ${key} (name) VALUES ($1) RETURNING id`,
      [name],
    );

    const id = rows[0]?.id;
    if (id !== undefined) cacheEntity(key, { id, name });
  };
}

export async function getRecentlyAddedBooks(): Promise<Book[]> {
  const cachedRecentlyAddedBooks = getCachedRecentlyAddedBooks();
  if (cachedRecentlyAddedBooks !== null) return cachedRecentlyAddedBooks;

  const { rows } = await pool.query(
    `SELECT books.*, authors.name AS author, genres.name AS genre 
      FROM books
      INNER JOIN authors ON books.author_id = authors.id
      INNER JOIN genres ON books.genre_id = genres.id 
      ORDER BY id DESC 
      LIMIT 4
    `,
  );
  cacheRecentlyAddedBooks(rows);

  return rows;
}

export async function getBooksByGenreAndQuery(options: {
  genreId?: number;
  query?: string;
  page?: number;
  useCache?: boolean;
}): Promise<{ books: Book[]; pages: number }> {
  const { genreId, query, page = 1, useCache = true } = options;

  if (useCache && genreId && !query) {
    const cachedBooks = getCachedBooksByEntity("genre", genreId, page);

    if (cachedBooks) {
      return {
        books: cachedBooks,
        pages: getCachedPagesByEntity("genre", genreId),
      };
    } else {
      const { pages, books } = await getBooksByGenreAndQuery({
        genreId,
        page,
        useCache: false,
      });
      cacheBooksByEntity("genre", { id: genreId, books, page, pages });

      return { pages, books };
    }
  }

  const params: (number | string)[] = [];
  const conditions: string[] = [];
  const offset = (page - 1) * PAGE_LIMIT;

  if (genreId) {
    conditions.push(`genre_id = $${params.length + 1}`);
    params.push(genreId);
  }

  if (query) {
    const searchParam = `%${query}%`;
    const placeholder = params.length + 1;

    const searchConditions = [
      `books.title ILIKE $${placeholder}`,
      `authors.name ILIKE $${placeholder}`,
      `books.isbn ILIKE $${placeholder}`,
    ];

    conditions.push(`(${searchConditions.join(" OR ")})`);
    params.push(searchParam);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const countSql = `
    SELECT COUNT(*) FROM books 
    INNER JOIN authors ON books.author_id = authors.id
    INNER JOIN genres ON books.genre_id = genres.id 
    ${whereClause}
  `;

  const countResult = await pool.query(countSql, params);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  const pages = Math.ceil(totalCount / PAGE_LIMIT);

  const booksSql = `
    SELECT books.*, authors.name AS author, genres.name AS genre 
    FROM books
    INNER JOIN authors ON books.author_id = authors.id
    INNER JOIN genres ON books.genre_id = genres.id 
    ${whereClause} 
    ORDER BY id DESC 
    LIMIT ${PAGE_LIMIT} 
    OFFSET ${offset} 
  `;

  const booksResults = await pool.query(booksSql, params);

  return { books: booksResults.rows, pages };
}

export async function getBooksByAuthor(
  authorId: number,
  page: number = 1,
): Promise<{ books: Book[]; pages: number }> {
  const cachedBooks = getCachedBooksByEntity("author", authorId, page);
  if (cachedBooks) {
    return {
      books: cachedBooks,
      pages: getCachedPagesByEntity("author", authorId),
    };
  }

  const offset = (page - 1) * PAGE_LIMIT;

  const countSql = await pool.query(
    `SELECT COUNT(*) FROM books 
     INNER JOIN authors ON books.author_id = authors.id 
     INNER JOIN genres ON books.genre_id = genres.id 
     WHERE author_id = $1`,
    [authorId],
  );

  const totalCount = parseInt(countSql.rows[0].count, 10);
  const pages = Math.ceil(totalCount / PAGE_LIMIT);

  const { rows: books } = await pool.query(
    `SELECT books.*, authors.name AS author, genres.name AS genre 
     FROM books 
     INNER JOIN authors ON books.author_id = authors.id 
     INNER JOIN genres ON books.genre_id = genres.id 
     WHERE books.author_id = $1 
     ORDER BY id DESC 
     LIMIT $2 OFFSET $3`,
    [authorId, PAGE_LIMIT, offset],
  );

  cacheBooksByEntity("author", { id: authorId, page, pages, books });
  return { books, pages };
}

export async function getBookById(bookId: number): Promise<Book | null> {
  const cachedBook = getCachedBookById(bookId);
  if (cachedBook) return cachedBook;

  const { rows } = await pool.query(
    `SELECT books.*, authors.name AS author, genres.name AS genre 
     FROM books 
     INNER JOIN authors ON books.author_id = authors.id
     INNER JOIN genres ON books.genre_id = genres.id
     WHERE books.id = $1`,
    [bookId],
  );

  return rows.length ? rows[0] : null;
}

export async function getAuthorByName(name: string): Promise<Entity | null> {
  const { rows } = await pool.query(
    `SELECT * FROM authors WHERE name ILIKE $1`,
    [name],
  );

  return rows.length ? rows[0] : null;
}

export async function getSecretPassword(): Promise<string> {
  const cachedPassword = getCachedPassword();
  if (cachedPassword !== null) return cachedPassword;

  const { rows } = await pool.query(
    `SELECT password FROM secret_password WHERE id = 1`,
  );

  const password = rows.length ? rows[0].password : "";
  updateCachedPassword(password);

  return password;
}

export async function updateSecretPassword(password: string) {
  const currentPassword = await getSecretPassword();

  if (currentPassword) {
    await pool.query("UPDATE secret_password SET password = $1 WHERE id = 1", [
      password,
    ]);
  } else {
    await pool.query(
      "INSERT INTO secret_password (id, password) VALUES (1, $1)",
      [password],
    );
  }

  updateCachedPassword(password);
}

export async function insertBook(book: BookFormData) {
  await pool.query(
    `INSERT INTO books (
      isbn, title, cover, description, publication_year, pages, author_id, genre_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )`,
    [
      book.isbn,
      book.title,
      book.cover,
      book.description || null,
      book.publication_year,
      book.pages,
      book.author_id,
      book.genre_id,
    ],
  );

  invalidateCachedBooks(book.author_id, book.genre_id);
}

export async function updateBook(id: number, bookData: BookFormData) {
  await pool.query(
    `UPDATE books SET
      title = $1,
      cover = $2,
      description = $3,
      publication_year = $4,
      pages = $5,
      author_id = $6,
      genre_id = $7 
    WHERE id = $8
    `,
    [
      bookData.title,
      bookData.cover,
      bookData.description || null,
      bookData.publication_year,
      bookData.pages,
      bookData.author_id,
      bookData.genre_id,
      id,
    ],
  );

  invalidateCachedBooks(bookData.author_id, bookData.genre_id);
}

export async function checkBookByISBN(isbn: string) {
  const { rows } = await pool.query("SELECT * FROM books WHERE isbn = $1", [
    isbn,
  ]);

  return rows.length > 0;
}

export function checkDuplicateEntity(table: string) {
  return async function (name: string, id?: number) {
    const params: (string | number)[] = [name];
    let query = `SELECT * FROM ${table} WHERE name = $1`;

    if (id !== undefined) {
      params.push(id);
      query += " AND id != $2";
    }

    const { rows } = await pool.query(query, params);
    return rows.length > 0;
  };
}

export async function getMoreBooksByAuthor(
  authorId: number,
  bookId: number,
): Promise<Book[]> {
  const cachedBooks = getCachedBooksByEntity("author", authorId);
  if (cachedBooks) {
    return cachedBooks.filter((book) => book.id !== bookId).slice(0, 5);
  }

  await getBooksByAuthor(authorId);

  const { rows } = await pool.query(
    `SELECT books.*, authors.name AS author, genres.name AS genre 
     FROM books 
     INNER JOIN authors ON books.author_id = authors.id 
     INNER JOIN genres ON books.genre_id = genres.id 
     WHERE books.author_id = $1 AND books.id != $2
     ORDER BY id DESC 
     LIMIT 5`,
    [authorId, bookId],
  );

  return rows;
}

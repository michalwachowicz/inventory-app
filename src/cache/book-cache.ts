import { Book } from "../types/book";
import { TTLCache } from "../types/ttl-cache";

const BOOK_TTL = 60 * 5000; // 5 minutes
const MISSING_PAGE = Symbol("missing_page");

type BookIds = number[] | typeof MISSING_PAGE;
type PagedBooks = Map<number, BookIds>;
type EntityType = "genre" | "author";

const bookMap = new Map<number, TTLCache<Book>>();
const authorBooks = new Map<number, PagedBooks>();
const genresBooks = new Map<number, PagedBooks>();

let recentlyAdded: BookIds = MISSING_PAGE;

function isBookExpired(book: TTLCache<Book>): boolean {
  return book.expires <= Date.now();
}

function getMapFromType(type: EntityType) {
  return type === "genre" ? genresBooks : authorBooks;
}

export function getCachedBookById(id: number): Book | null {
  const book = bookMap.get(id);
  if (!book || isBookExpired(book)) return null;
  return book.value;
}

function updateBooks(books: Book[]) {
  const now = Date.now();

  for (const book of books) {
    bookMap.set(book.id, { value: book, expires: now + BOOK_TTL });
  }
}

function getBooks(bookIds: BookIds, invalidator: () => void): Book[] | null {
  if (bookIds === MISSING_PAGE) return null;

  const now = Date.now();
  const books: Book[] = [];

  for (const bookId of bookIds) {
    const book = bookMap.get(bookId);

    if (!book || book.expires <= now) {
      invalidator();
      return null;
    }

    books.push(book.value);
  }

  return books;
}

function invalidateRecentlyAdded() {
  recentlyAdded = MISSING_PAGE;
}

function invalidatePageBooks(type: EntityType) {
  const map = getMapFromType(type);

  return function (id: number, page?: number) {
    if (page === undefined) {
      map.delete(id);
      return;
    }

    map.get(id)?.delete(page);
  };
}

export function invalidateCachedBooks(authorId: number, genreId: number) {
  invalidatePageBooks("author")(authorId);
  invalidatePageBooks("genre")(genreId);

  invalidateRecentlyAdded();
}

export function getCachedRecentlyAddedBooks(): Book[] | null {
  return getBooks(recentlyAdded, invalidateRecentlyAdded);
}

export function cacheRecentlyAddedBooks(books: Book[]) {
  recentlyAdded = books.map((book) => book.id);
  updateBooks(books);
}

export function getCachedBooksByEntity(
  type: EntityType,
  id: number,
  page: number = 1,
): Book[] | null {
  const cachedPages = getMapFromType(type).get(id);
  if (!cachedPages) return null;

  const cachedBooks = cachedPages.get(page);
  if (!cachedBooks || cachedBooks === MISSING_PAGE) return null;

  return getBooks(cachedBooks, () => {
    invalidatePageBooks(type)(id, page);
  });
}

export function getCachedPagesByEntity(type: EntityType, id: number) {
  const cachedPages = getMapFromType(type).get(id);
  if (!cachedPages) return 0;

  return cachedPages.size;
}

export function cacheBooksByEntity(
  type: EntityType,
  options: {
    id: number;
    page?: number;
    pages?: number;
    books: Book[];
  },
) {
  const { id, page, pages, books } = options;
  const map = getMapFromType(type);

  if (!map.get(id)) map.set(id, new Map());
  const pageMap = map.get(id)!;

  pageMap.set(
    page || 1,
    books.map((book) => book.id),
  );

  for (let i = 1; i <= (pages || 0); i++) {
    if (page && i === page) continue;

    const cachedPage = pageMap.get(i);
    if (cachedPage && Array.isArray(cachedPage)) continue;

    pageMap.set(i, MISSING_PAGE);
  }

  updateBooks(books);
}

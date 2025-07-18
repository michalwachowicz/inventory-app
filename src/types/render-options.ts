import { Author } from "./author";
import { Book } from "./book";
import { Genre } from "./genre";

export interface RenderOptions {
  viewName: string;
  title?: string;
  navbar?: "basic" | "full";
  selectedGenre?: Genre;
}

export interface BookRenderOptions extends RenderOptions {
  book?: Book;
  moreByAuthor?: Book[];
}

export interface BookFormRenderOptions extends RenderOptions {
  book?: Book;
  action: "add" | "edit";
  authors: Author[];
  genres: Genre[];
  errors?: Record<string, string>;
}

export interface HomeRenderOptions extends RenderOptions {
  recentlyAddedBooks: Book[];
}

export interface ErrorRenderOptions extends RenderOptions {
  errorMessage: string;
}

export interface ResultsRenderOptions extends RenderOptions {
  results: Book[];
  pages: number;
  currentPage: number;
  baseQueryString: string;
  pageTitle?: string;
}

export interface QueryRenderOptions extends ResultsRenderOptions {
  query?: string;
}

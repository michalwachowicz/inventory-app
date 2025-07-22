import { Book } from "./book";
import { Entity } from "./entity";

export interface RenderOptions {
  viewName: string;
  title?: string;
  navbar?: "basic" | "full";
  selectedGenre?: Entity;
}

export interface SuccessRenderOptions {
  entity: string;
  action: string;
}

export interface BookRenderOptions extends RenderOptions {
  book?: Book;
  moreByAuthor?: Book[];
}

export interface EntityFormRenderOptions extends RenderOptions {
  entityName: string;
  entity?: Entity;
  action: "add" | "edit";
  errors?: Record<string, string>;
}

export interface BookFormRenderOptions extends RenderOptions {
  book?: Book;
  action: "add" | "edit";
  authors: Entity[];
  genres: Entity[];
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

export interface AuthorRenderOptions extends ResultsRenderOptions {
  authorId: number;
}

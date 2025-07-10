import { Book } from "./book";

export interface RenderOptions {
  viewName: string;
  title?: string;
  navbar?: "basic" | "full";
  selectedGenreId?: string;
}

export interface HomeRenderOptions extends RenderOptions {
  recentlyAddedBooks: Book[];
}

export interface ResultsRenderOptions extends RenderOptions {
  results: Book[];
  pages: number;
}

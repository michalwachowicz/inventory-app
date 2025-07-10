import { Book } from "./book";

export interface RenderOptions {
  viewName: string;
  title?: string;
  navbar?: "basic" | "full";
  results?: Book[];
}

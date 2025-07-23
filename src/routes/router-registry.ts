import { Express } from "express";
import homeRouter from "./home-router";
import resultsRouter from "./results-router";
import authorRouter from "./author-router";
import bookRouter from "./book-router";
import apiRouter from "./api-router";
import genreRouter from "./genre-router";

export function registerRouters(app: Express) {
  app.use("/", homeRouter);
  app.use("/results", resultsRouter);
  app.use("/author", authorRouter);
  app.use("/book", bookRouter);
  app.use("/genre", genreRouter);
  app.use("/api", apiRouter);
}

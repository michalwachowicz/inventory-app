import { Router } from "express";
import {
  getGenreAddForm,
  getGenreEditForm,
  postGenreDelete,
} from "../controllers/genre-controller";
import { getSuccessView } from "../controllers/success-controller";

const genreRouter = Router();

genreRouter.get("/add/success", getSuccessView("genre", "added"));
genreRouter.get("/add", getGenreAddForm);

genreRouter.get("/edit/success", getSuccessView("genre", "edited"));
genreRouter.get("/edit/:genreId", getGenreEditForm);

genreRouter.get("/delete/success", getSuccessView("genre", "deleted"));
genreRouter.post("/delete/:genreId", postGenreDelete);

export default genreRouter;

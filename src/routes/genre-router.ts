import { Router } from "express";
import {
  getGenreAddForm,
  getGenreAddSuccessView,
  getGenreDeleteSuccessView,
  getGenreEditForm,
  getGenreEditSuccessView,
  postGenreDelete,
} from "../controllers/genre-controller";

const genreRouter = Router();

genreRouter.get("/add/success", getGenreAddSuccessView);
genreRouter.get("/add", getGenreAddForm);

genreRouter.get("/edit/success", getGenreEditSuccessView);
genreRouter.get("/edit/:genreId", getGenreEditForm);

genreRouter.get("/delete/success", getGenreDeleteSuccessView);
genreRouter.post("/delete/:genreId", postGenreDelete);

export default genreRouter;

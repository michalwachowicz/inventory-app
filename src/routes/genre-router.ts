import { Router } from "express";
import {
  getGenreEditForm,
  postGenreDelete,
} from "../controllers/genre-controller";
import { getSuccessView } from "../controllers/success-controller";
import { getEntityAddForm } from "../controllers/entity-controller";

const genreRouter = Router();

genreRouter.get("/add/success", getSuccessView("genre", "added"));
genreRouter.get("/add", getEntityAddForm("genre"));

genreRouter.get("/edit/success", getSuccessView("genre", "edited"));
genreRouter.get("/edit/:genreId", getGenreEditForm());

genreRouter.get("/delete/success", getSuccessView("genre", "deleted"));
genreRouter.post("/delete/:genreId", postGenreDelete());

export default genreRouter;

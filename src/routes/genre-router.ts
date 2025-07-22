import { Router } from "express";
import {
  getGenreDeleteSuccessView,
  postGenreDelete,
} from "../controllers/genre-controller";

const genreRouter = Router();

genreRouter.get("/delete/success", getGenreDeleteSuccessView);
genreRouter.post("/delete/:genreId", postGenreDelete);

export default genreRouter;

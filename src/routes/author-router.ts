import { Router } from "express";
import {
  getAuthorAddForm,
  getAuthorAddSuccessView,
  getAuthorBooks,
  getAuthorDeleteSuccessView,
  getAuthorEditForm,
  getAuthorEditSuccessView,
  postAuthorDelete,
} from "../controllers/author-controller";

const authorRouter = Router();

authorRouter.get("/add/success", getAuthorAddSuccessView);
authorRouter.get("/add", getAuthorAddForm);

authorRouter.get("/edit/success", getAuthorEditSuccessView);
authorRouter.get("/edit/:authorId", getAuthorEditForm);

authorRouter.get("/delete/success", getAuthorDeleteSuccessView);
authorRouter.post("/delete/:authorId", postAuthorDelete);

authorRouter.get("/:authorId", getAuthorBooks);

export default authorRouter;

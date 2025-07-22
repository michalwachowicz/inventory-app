import { Router } from "express";
import {
  getAuthorAddForm,
  getAuthorBooks,
  getAuthorEditForm,
  postAuthorDelete,
} from "../controllers/author-controller";
import { getSuccessView } from "../controllers/success-controller";

const authorRouter = Router();

authorRouter.get("/add/success", getSuccessView("author", "added"));
authorRouter.get("/add", getAuthorAddForm);

authorRouter.get("/edit/success", getSuccessView("author", "edited"));
authorRouter.get("/edit/:authorId", getAuthorEditForm);

authorRouter.get("/delete/success", getSuccessView("author", "deleted"));
authorRouter.post("/delete/:authorId", postAuthorDelete);

authorRouter.get("/:authorId", getAuthorBooks);

export default authorRouter;

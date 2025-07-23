import { Router } from "express";
import {
  getAuthorBooks,
  getAuthorEditForm,
  postAuthorAdd,
  postAuthorDelete,
  postAuthorEdit,
} from "../controllers/author-controller";
import { getSuccessView } from "../controllers/success-controller";
import { getEntityAddForm } from "../controllers/entity-controller";

const authorRouter = Router();

authorRouter.get("/add/success", getSuccessView("author", "added"));
authorRouter.get("/add", getEntityAddForm("author"));
authorRouter.post("/add", postAuthorAdd());

authorRouter.get("/edit/success", getSuccessView("author", "edited"));
authorRouter.get("/edit/:authorId", getAuthorEditForm());
authorRouter.post("/edit/:authorId", postAuthorEdit());

authorRouter.get("/delete/success", getSuccessView("author", "deleted"));
authorRouter.post("/delete/:authorId", postAuthorDelete());

authorRouter.get("/:authorId", getAuthorBooks);

export default authorRouter;

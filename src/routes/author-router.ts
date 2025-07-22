import { Router } from "express";
import {
  getAuthorBooks,
  getAuthorDeleteSuccessView,
  postAuthorDelete,
} from "../controllers/author-controller";

const authorRouter = Router();

authorRouter.get("/delete/success", getAuthorDeleteSuccessView);
authorRouter.post("/delete/:authorId", postAuthorDelete);

authorRouter.get("/:authorId", getAuthorBooks);

export default authorRouter;

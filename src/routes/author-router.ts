import { Router } from "express";
import { getAuthorBooks } from "../controllers/author-controller";

const authorRouter = Router();

authorRouter.get("/:authorId", getAuthorBooks);

export default authorRouter;

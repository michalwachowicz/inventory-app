import { Router } from "express";
import { fetchBookData } from "../controllers/book-controller";

const apiRouter = Router();

apiRouter.get("/book/:isbn", fetchBookData);

export default apiRouter;

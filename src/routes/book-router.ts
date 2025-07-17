import { Router } from "express";
import {
  getBookAddForm,
  getBookEditForm,
} from "../controllers/book-controller";

const bookRouter = Router();

bookRouter.get("/add", getBookAddForm);
bookRouter.get("/edit/:bookId", getBookEditForm);

export default bookRouter;

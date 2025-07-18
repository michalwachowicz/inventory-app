import { Router } from "express";
import {
  getBookAddForm,
  getBookEditForm,
  postBookAdd,
} from "../controllers/book-controller";

const bookRouter = Router();

bookRouter.get("/add", getBookAddForm);
bookRouter.post("/add", postBookAdd);

bookRouter.get("/edit/:bookId", getBookEditForm);

export default bookRouter;

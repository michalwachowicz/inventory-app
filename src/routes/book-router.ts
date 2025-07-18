import { Router } from "express";
import {
  getBookAddForm,
  getBookEditForm,
  postBookAdd,
  postBookEdit,
} from "../controllers/book-controller";

const bookRouter = Router();

bookRouter.get("/add", getBookAddForm);
bookRouter.post("/add", postBookAdd);

bookRouter.get("/edit/:bookId", getBookEditForm);
bookRouter.post("/edit/:bookId", postBookEdit);

export default bookRouter;

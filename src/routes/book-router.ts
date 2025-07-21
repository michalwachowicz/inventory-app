import { Router } from "express";
import {
  getBook,
  getBookAddForm,
  getBookAddSuccessView,
  getBookEditForm,
  getBookEditSuccessView,
  postBookAdd,
  postBookEdit,
} from "../controllers/book-controller";

const bookRouter = Router();

bookRouter.get("/add/success", getBookAddSuccessView);
bookRouter.get("/add", getBookAddForm);
bookRouter.post("/add", postBookAdd);

bookRouter.get("/edit/success", getBookEditSuccessView);
bookRouter.get("/edit/:bookId", getBookEditForm);
bookRouter.post("/edit/:bookId", postBookEdit);

bookRouter.get("/:bookId", getBook);

export default bookRouter;

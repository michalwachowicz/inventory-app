import { Router } from "express";
import {
  getBook,
  getBookAddForm,
  postBookDelete,
  getBookEditForm,
  postBookAdd,
  postBookEdit,
} from "../controllers/book-controller";
import { getSuccessView } from "../controllers/success-controller";

const bookRouter = Router();

bookRouter.get("/add/success", getSuccessView("book", "added"));
bookRouter.get("/add", getBookAddForm);
bookRouter.post("/add", postBookAdd);

bookRouter.get("/edit/success", getSuccessView("book", "edited"));
bookRouter.get("/edit/:bookId", getBookEditForm);
bookRouter.post("/edit/:bookId", postBookEdit);

bookRouter.get("/delete/success", getSuccessView("book", "deleted"));
bookRouter.post("/delete/:bookId", postBookDelete);

bookRouter.get("/:bookId", getBook);

export default bookRouter;

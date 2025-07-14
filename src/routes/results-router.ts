import { Router } from "express";
import { getResults } from "../controllers/results-controller";

const resultsRouter = Router();

resultsRouter.get("/", getResults);

export default resultsRouter;

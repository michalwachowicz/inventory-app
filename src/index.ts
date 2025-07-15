import express from "express";
import path from "path";
import { config } from "dotenv";
import { initDatabase } from "./db/queries";
import homeRouter from "./routes/homeRouter";
import resultsRouter from "./routes/results-router";
import authorRouter from "./routes/author-router";

config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", homeRouter);
app.use("/results", resultsRouter);
app.use("/author", authorRouter);

initDatabase()
  .then(() => {
    console.log("Connected to the database successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

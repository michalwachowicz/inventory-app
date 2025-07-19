import express from "express";
import path from "path";
import { config } from "dotenv";
import { initDatabase } from "./db/queries";
import homeRouter from "./routes/home-router";
import resultsRouter from "./routes/results-router";
import authorRouter from "./routes/author-router";
import bookRouter from "./routes/book-router";
import apiRouter from "./routes/api-router";

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
app.use("/book", bookRouter);
app.use("/api", apiRouter);

app.get("/{*splat}", (_, res) => {
  res.render("not-found");
});

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

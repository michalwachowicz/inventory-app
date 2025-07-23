import { initDatabase, insertEntity, insertBook } from "./queries";
import { authors, books, genres } from "./sample-data";

async function generateData() {
  try {
    console.log("Initializing tables...");
    await initDatabase();

    console.log("Generating authors...");
    for (const author of authors) await insertEntity("authors")(author.name);

    console.log("Generating genres...");
    for (const genre of genres) await insertEntity("genres")(genre.name);

    console.log("Generaing books...");
    for (const book of books) await insertBook(book);

    console.log("Data generation completed!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to generate data", error);
    process.exit(1);
  }
}

generateData();

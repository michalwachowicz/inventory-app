export interface Book {
  id: number;
  isbn: string;
  title: string;
  description?: string;
  cover: string;
  publication_year: number;
  pages: number;
  author_id: number;
  genre_id: number;
  author?: string;
  genre?: string;
}

export type BookResponse = Omit<
  Book,
  "id" | "isbn" | "author" | "genre" | "genre_id" | "description"
>;

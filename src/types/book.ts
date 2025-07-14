export interface Book {
  id: number;
  isbn: string;
  title: string;
  description: string;
  cover: string;
  publicationYear: number;
  pages: number;
  authorId: number;
  genreId: number;
  author?: string;
  genre?: string;
}

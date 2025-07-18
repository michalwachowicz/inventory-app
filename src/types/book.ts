import z from "zod";
import { ISBNSchema } from "./isbn";

export const BookSchema = z.object({
  id: z.number(),
  isbn: ISBNSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  cover: z.url(),
  publication_year: z.coerce.number().min(1).max(new Date().getFullYear()),
  pages: z.coerce.number().min(1).max(20000),
  author_id: z.coerce.number().min(1),
  genre_id: z.coerce.number().min(1),
  author: z.string().optional(),
  genre: z.string().optional(),
});

export const BookFormSchema = BookSchema.omit({
  id: true,
  author: true,
  genre: true,
});

export type Book = z.infer<typeof BookSchema>;
export type BookFormData = z.infer<typeof BookFormSchema>;

export type BookResponse = Omit<
  Book,
  "id" | "isbn" | "author" | "genre" | "genre_id" | "description"
>;

import { Genre } from "../types/genre";
import pool from "./pool";

async function createAuthorsTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
  )`);
}

async function createGenresTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
  )`);
}

async function createBooksTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS books (
    isbn VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    publication_year INTEGER NOT NULL,
    pages INTEGER NOT NULL,
    author_id INTEGER NOT NULL REFERENCES authors(id),
    genre_id INTEGER NOT NULL REFERENCES genres(id)
  )`);
}

async function createSecretPasswordTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS secret_password (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    password TEXT NOT NULL
  )`);
}

export async function initDatabase() {
  await createAuthorsTable();
  await createGenresTable();
  await createBooksTable();
  await createSecretPasswordTable();
}

export async function getGenres(): Promise<Genre[]> {
  const { rows } = await pool.query(`SELECT * FROM genres`);
  return rows;
}

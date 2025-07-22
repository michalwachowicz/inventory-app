import { deleteGenreById, getGenreById } from "../db/queries";
import { getEntityDeleteMethod, getEntityPostForm } from "./entity-controller";

export function getGenreEditForm() {
  return getEntityPostForm("genre", getGenreById);
}

export function postGenreDelete() {
  return getEntityDeleteMethod("genre", deleteGenreById);
}

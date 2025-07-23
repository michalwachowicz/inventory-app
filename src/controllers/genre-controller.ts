import { deleteGenreById, getGenreById } from "../db/queries";
import {
  getEntityDeleteMethod,
  getEntityPostForm,
  getEntityPostMethod,
} from "./entity-controller";

function getGenrePostMethod(action: "add" | "edit") {
  return getEntityPostMethod({ action, entityName: "genre" });
}

export function getGenreEditForm() {
  return getEntityPostForm("genre", getGenreById);
}

export function postGenreDelete() {
  return getEntityDeleteMethod("genre", deleteGenreById);
}

export function postGenreAdd() {
  return getGenrePostMethod("add");
}

export function postGenreEdit() {
  return getGenrePostMethod("edit");
}

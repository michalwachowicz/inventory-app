import { deleteEntityById, getEntityById } from "../db/queries";
import {
  getEntityDeleteMethod,
  getEntityPostForm,
  getEntityPostMethod,
} from "./entity-controller";

function getGenrePostMethod(action: "add" | "edit") {
  return getEntityPostMethod({ action, entityName: "genre" });
}

export function getGenreEditForm() {
  return getEntityPostForm("genre", getEntityById("genres"));
}

export function postGenreDelete() {
  return getEntityDeleteMethod("genre", deleteEntityById("genres"));
}

export function postGenreAdd() {
  return getGenrePostMethod("add");
}

export function postGenreEdit() {
  return getGenrePostMethod("edit");
}

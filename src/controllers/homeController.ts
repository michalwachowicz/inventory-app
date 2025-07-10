import { Request, Response } from "express";
import { getRecentlyAddedBooks } from "../db/queries";
import { renderView } from "../utils/viewRenderer";

export async function getHome(_: Request, res: Response) {
  const results = await getRecentlyAddedBooks();

  await renderView(res, {
    title: "Home",
    viewName: "home",
    navbar: "full",
    results,
  });
}

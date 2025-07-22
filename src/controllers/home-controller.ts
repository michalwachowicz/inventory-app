import { Request, Response } from "express";
import { getRecentlyAddedBooks } from "../db/queries";
import { renderView } from "../utils/view-renderer";
import { HomeRenderOptions } from "../types/render-options";

export async function getHome(_: Request, res: Response) {
  const recentlyAddedBooks = await getRecentlyAddedBooks();

  await renderView<HomeRenderOptions>(res, {
    title: "Home",
    viewName: "home",
    navbar: "full",
    recentlyAddedBooks,
  });
}

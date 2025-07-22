import { Response } from "express";
import { Genre } from "../types/genre";
import { getGenres } from "../db/queries";
import { RenderOptions, SuccessRenderOptions } from "../types/render-options";
import { capitalize } from "./capitalize";

export async function renderView<T extends RenderOptions = RenderOptions>(
  res: Response,
  options: T,
) {
  const genres: Genre[] = options.navbar === "full" ? await getGenres() : [];
  res.render("index", { genres, ...options });
}

export async function renderSuccessView(
  res: Response,
  options: SuccessRenderOptions,
) {
  const { entity, action } = options;
  const viewOptions = {
    title: `${capitalize(entity)} ${capitalize(action)}`,
    text: `A${entity.match(/^[aieouAIEOU].*/) ? "n" : ""} ${entity} was ${action} successfully!`,
  };

  res.render("success", viewOptions);
}

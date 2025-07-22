import { Response } from "express";
import { getGenres } from "../db/queries";
import { RenderOptions, SuccessRenderOptions } from "../types/render-options";
import { capitalize } from "./capitalize";
import { Entity } from "../types/entity";

export async function renderView<T extends RenderOptions = RenderOptions>(
  res: Response,
  options: T,
) {
  const genres: Entity[] = options.navbar === "full" ? await getGenres() : [];
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

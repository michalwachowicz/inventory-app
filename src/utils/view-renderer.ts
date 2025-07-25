import { Response } from "express";
import {
  ErrorRenderOptions,
  RenderOptions,
  SuccessRenderOptions,
} from "../types/render-options";
import { capitalize } from "./capitalize";
import { Entity } from "../types/entity";
import { getEntities } from "../db/queries";

export async function renderView<T extends RenderOptions = RenderOptions>(
  res: Response,
  options: T,
) {
  const genres: Entity[] =
    options.navbar === "full" ? await getEntities("genres") : [];

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

export async function renderErrorView(
  res: Response,
  options: Pick<ErrorRenderOptions, "title" | "errorMessage">,
) {
  await renderView<ErrorRenderOptions>(res, {
    viewName: "error",
    navbar: "basic",
    ...options,
  });
}

export async function renderInvalidIdErrorView(
  res: Response,
  entityName: string,
) {
  const capitalizedEntity = capitalize(entityName);

  renderErrorView(res, {
    title: `Invalid ${capitalizedEntity} ID`,
    errorMessage: `${capitalizedEntity} ID must be a number`,
  });
}

export async function renderServerErrorView(res: Response, err: unknown) {
  renderErrorView(res, {
    title: "Server Error",
    errorMessage: err instanceof Error ? err.message : "Unknown error",
  });
}

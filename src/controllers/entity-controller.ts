import { Request, Response } from "express";
import { Entity } from "../types/entity";
import { EntityFormRenderOptions } from "../types/render-options";
import { capitalize } from "../utils/capitalize";
import { renderView } from "../utils/viewRenderer";
import { checkPassword } from "../utils/password-utils";

export async function renderEntityForm(
  res: Response,
  options: {
    action: "add" | "edit";
    entityName: string;
    entity?: Entity;
    errors?: Record<string, string>;
  },
) {
  const { action, entityName, entity, errors } = options;

  renderView<EntityFormRenderOptions>(res, {
    viewName: "entity-form",
    title: `${capitalize(action)} ${capitalize(entityName)}`,
    navbar: "basic",
    entityName,
    entity,
    action,
    errors,
  });
}

export function getEntityAddForm(entityName: string) {
  return async function (_: Request, res: Response) {
    await renderEntityForm(res, { action: "add", entityName });
  };
}

export function getEntityPostForm(
  entityName: string,
  getQuery: (id: number) => Promise<Entity | null>,
) {
  return async function (req: Request, res: Response) {
    const idParam = `${entityName}Id`;
    const id = Number(req.params[idParam]);

    if (isNaN(id)) {
      res.status(400).send(`Invalid ${entityName} ID`);
      return;
    }

    const entity = await getQuery(id);
    if (entity === null) {
      res.status(404).send(`${capitalize(entityName)} not found`);
      return;
    }

    await renderEntityForm(res, { action: "edit", entityName, entity });
  };
}

export function getEntityDeleteMethod(
  entityName: string,
  deleteQuery: (id: number) => Promise<boolean>,
) {
  const capitalizedEntity = capitalize(entityName);

  return async function (req: Request, res: Response) {
    const idParam = `${entityName}Id`;
    const id = Number(req.params[idParam]);

    if (isNaN(id)) {
      res.status(400).send({ error: `Invalid ${entityName} ID` });
      return;
    }

    try {
      const isAuthorized = await checkPassword(req.body.secret_password);
      if (!isAuthorized) {
        res.status(400).send({ error: "Invalid password" });
        return;
      }

      const isDeleted = await deleteQuery(id);
      if (!isDeleted) {
        res.status(404).send({ error: `${capitalizedEntity} not found` });
        return;
      }

      res
        .status(200)
        .send({ message: `${capitalizedEntity} deleted successfully` });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: `Failed to delete ${entityName}, check console for details`,
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };
}

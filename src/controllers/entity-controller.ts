import { Request, Response } from "express";
import { Entity, EntityFormSchema } from "../types/entity";
import { EntityFormRenderOptions } from "../types/render-options";
import { capitalize } from "../utils/capitalize";
import {
  renderErrorView,
  renderInvalidIdErrorView,
  renderServerErrorView,
  renderView,
} from "../utils/view-renderer";
import { checkPassword } from "../utils/password-utils";
import {
  checkDuplicateEntity,
  insertEntity,
  updateEntity,
} from "../db/queries";
import { createZodErrorsObject } from "../utils/zod-error";
import { isCacheEntityKey } from "../cache/entity-cache";

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

export function getEntityPostForm<T = Entity>(
  entityName: string,
  getQuery: (id: number) => Promise<T | null>,
  renderFunction?: (res: Response, entity: T) => Promise<void>,
) {
  return async function (req: Request, res: Response) {
    const idParam = `${entityName}Id`;
    const id = Number(req.params[idParam]);
    const capitalizedEntity = capitalize(entityName);

    if (isNaN(id)) {
      renderInvalidIdErrorView(res, entityName);
      return;
    }

    const entity = await getQuery(id);
    if (entity === null) {
      renderErrorView(res, {
        title: `${capitalizedEntity} Not Found`,
        errorMessage: `${capitalizedEntity} with ID ${id} was not found`,
      });
      return;
    }

    if (renderFunction) await renderFunction(res, entity as T);
    else {
      await renderEntityForm(res, {
        action: "edit",
        entityName,
        entity: entity as Entity,
      });
    }
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

export function getEntityPostMethod({
  action,
  entityName,
  table,
}: {
  action: "add" | "edit";
  entityName: string;
  table?: string;
}) {
  return async function (req: Request, res: Response) {
    const result = EntityFormSchema.safeParse(req.body);
    const errors = createZodErrorsObject(result);

    try {
      const idParam = `${entityName}Id`;
      const id = Number(req.params[idParam]);

      if (action === "edit" && isNaN(id))
        throw new Error(`Invalid ${entityName} ID`);

      const { name } = req.body;
      const tableName = table || `${entityName}s`;

      const entityExists = await checkDuplicateEntity(tableName)(
        name,
        action === "edit" ? id : undefined,
      );

      if (entityExists)
        errors.name = `${capitalize(entityName)} with this name already exists`;

      const isAuthorized = await checkPassword(req.body.secret_password);
      if (!isAuthorized) errors.secret_password = "Invalid password";

      if (Object.keys(errors).length > 0) {
        await renderEntityForm(res, {
          action,
          entityName,
          entity: id ? { id, ...req.body } : undefined,
          errors,
        });
        return;
      }

      if (isCacheEntityKey(tableName)) {
        if (action === "edit") await updateEntity(tableName)(id, name);
        else await insertEntity(tableName)(name);
      }

      res.redirect(`/${entityName}/${action}/success`);
    } catch (err) {
      console.error("Unexpected error:", err);
      renderServerErrorView(res, err);
    }
  };
}

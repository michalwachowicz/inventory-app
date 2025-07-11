import { Request } from "express";

export function buildBaseQueryString(req: Request) {
  const params: [string, string][] = [];

  for (const key in req.query) {
    if (key === "currentPage") continue;

    const value = req.query[key];

    if (typeof value === "string") {
      params.push([key, value]);
    } else if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === "string") params.push([key, v]);
      }
    }
  }

  return new URLSearchParams(params).toString();
}

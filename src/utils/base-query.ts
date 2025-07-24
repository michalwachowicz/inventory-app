import { Request } from "express";

export function buildBaseQueryString(
  req: Request,
  omit: string[] = ["currentPage"],
) {
  const params: Record<string, string> = {};

  for (const key in req.query) {
    if (omit.includes(key)) continue;
    const value = req.query[key];

    if (typeof value === "string") params[key] = value;
    else if (Array.isArray(value)) params[key] = value.join(",");
  }

  return new URLSearchParams(params).toString();
}

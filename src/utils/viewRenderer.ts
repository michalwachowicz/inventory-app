import { Response } from "express";

interface Genre {
  id: number;
  name: string;
}

interface RenderOptions {
  viewName: string;
  title?: string;
  navbar?: "basic" | "full";
  genres?: Genre[];
}

export default function renderView(res: Response, options: RenderOptions) {
  res.render("index", options);
}

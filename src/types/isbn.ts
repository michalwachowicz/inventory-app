import z from "zod";

export const ISBNSchema = z
  .string()
  .regex(
    /^(?:\d{9}[\dXx]|\d{13})$/,
    "ISBN must be a valid ISBN-10 or ISBN-13 format",
  );

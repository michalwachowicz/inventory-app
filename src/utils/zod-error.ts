import { ZodSafeParseResult } from "zod";

export function createZodErrorsObject<T>(
  result: ZodSafeParseResult<T>,
): Record<string, string> {
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const err of result.error.issues) {
    if (err.path.length > 0) errors[err.path[0].toString()] = err.message;
  }

  return errors;
}

import z from "zod";

export const EntitySchema = z.object({
  id: z.number(),
  name: z.string().min(1),
});

export const EntityFormSchema = EntitySchema.omit({ id: true });

export type Entity = z.infer<typeof EntitySchema>;
export type EntityFormData = z.infer<typeof EntityFormSchema>;

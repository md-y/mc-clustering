import { array, object, string } from 'zod';
import type z from 'zod';

export const tagFileSchema = object({
  values: array(string()),
});

export type TagFile = z.infer<typeof tagFileSchema>;

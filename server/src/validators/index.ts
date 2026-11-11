import { z } from 'zod';

export const updateFileSchema = z.object({
  filename: z.string().optional(),
  tags: z.array(z.string()).optional()
});

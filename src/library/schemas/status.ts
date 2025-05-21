import { z } from 'zod'

export const getStatusSchema = z.object({
    id_status: z.coerce.number().int().optional(),
    nom_status: z.string().optional(),
  }).strict()

export type StatusSearch = z.infer<typeof getStatusSchema>


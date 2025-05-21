import { z } from 'zod'

export const getStateSchema = z.object({
    id_estado: z.coerce.number().int().optional(),
    nom_estado: z.string().optional(),
    cod_uf_estado: z.string().optional()
  }).strict()

export type StateSearch = z.infer<typeof getStateSchema>


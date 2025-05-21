import { z } from 'zod'

export const getCitySchema = z.object({
    id_cidade: z.coerce.number().int().optional(),
    nom_cidade: z.string().optional(),
    id_estado: z.coerce.number().int().optional()
  }).strict()

export type CitySearch = z.infer<typeof getCitySchema>


import { z } from 'zod'

export const getCategorySchema = z.object({
    id_categoria: z.coerce.number().int().optional(),
    nom_categoria: z.string().optional()
  }).strict()

export const postCategorySchema = z.object({
    nom_categoria: z.string().min(1, "É obrigatório")
}).strict()

export const patchCategorySchema = z.object({
    id_categoria: z.number().int(),
    nom_categoria: z.string().min(1, "É obrigatório")
}).strict()

export type CategorySearch = z.infer<typeof getCategorySchema>

export type CategoryInput = z.infer<typeof postCategorySchema>

export type CategoryUpdate = z.infer<typeof patchCategorySchema>


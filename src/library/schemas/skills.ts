import { z } from 'zod'

export const getSkillSchema = z.object({
    id_habilidade: z.coerce.number().int().optional(),
    nom_habilidade: z.string().optional()
  }).strict()

export const postSkillSchema = z.object({
    nom_habilidade: z.string().min(1, "É obrigatório")
}).strict()

export const patchSkillSchema = z.object({
    id_habilidade: z.number().int(),
    nom_habilidade: z.string().min(1, "É obrigatório")
}).strict()

export type SkillSearch = z.infer<typeof getSkillSchema>

export type SkillInput = z.infer<typeof postSkillSchema>

export type SkillUpdate = z.infer<typeof patchSkillSchema>


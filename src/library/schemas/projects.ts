import { z } from 'zod'

export const getProjectSchema = z.object({
    id_projeto: z.coerce.number().int().optional(),
    nom_projeto: z.string().optional(),
    id_usuario_responsavel: z.coerce.number().int().optional(),
    dth_inicio_low: z.coerce.date().optional(),
    dth_inicio_high: z.coerce.date().optional(),
    dth_fim_low: z.coerce.date().optional(),
    dth_fim_high: z.coerce.date().optional()
   }).strict()

export const postProjectSchema = z.object({
    nom_projeto: z.string(),
    desc_projeto: z.string(),
    id_usuario_responsavel: z.number().int(),
    dth_inicio: z.coerce.date(),
    dth_fim: z.coerce.date()
}).strict()

export type ProjectSearch = z.infer<typeof getProjectSchema>

export type ProjectInput = z.infer<typeof postProjectSchema>

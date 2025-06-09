import { z } from 'zod'

export const getServiceSchema = z.object({
    id_servico: z.coerce.number().int().optional(),
    id_usuario_solicitante: z.coerce.number().int().optional(),
    id_usuario_prestador: z.coerce.number().int().optional(),
    id_usuario_busca: z.coerce.number().int().optional(),
    id_projeto_pai: z.coerce.number().int().optional(),
    id_cidade: z.coerce.number().int().optional(),
    id_status: z.coerce.number().int().optional(),
    dth_servico_low: z.coerce.date().optional(),
    dth_servico_high: z.coerce.date().optional(),
    dth_fim_servico_low: z.coerce.date().optional(),
    dth_fim_servico_high: z.coerce.date().optional(),
    id_habilidade: z.coerce.number().int().optional(),
    id_categoria: z.coerce.number().int().optional()
}).strict()

export const getConflictServiceSchema = z.object({
    id_usuario: z.coerce.number().int(),
    dth_servico: z.coerce.date(),
    dth_fim_servico: z.coerce.date()
}).strict()

export const getSkillsByServiceSchema = z.object({
    id_servico: z.coerce.number().int()
  }).strict()

export const getCategoriesByServiceSchema = z.object({
    id_servico: z.coerce.number().int()
  }).strict()

export const getProviderUsersByServiceSchema = z.object({
    id_servico: z.coerce.number().int()
  }).strict()

export const postServiceSchema = z.object({
    nom_servico: z.string(), 
    desc_servico: z.string(),
    id_usuario_solicitante: z.number().int(),
    id_projeto_pai: z.number().int().optional(),
    dth_servico: z.coerce.date(),
    dth_fim_servico: z.coerce.date(),
    num_tempo_estimado: z.number().int().optional(),
    num_novo_saldo: z.number().int().optional(),
    num_qtd_prestadores: z.number().int(),
    id_habilidade_lista: z.array(z.number().int()),
    id_categoria_lista: z.array(z.number().int())
}).strict()

export const patchProvideServiceSchema = z.object({
    id_servico: z.number().int(),
    id_usuario_prestador: z.number().int(),
    id_novo_status: z.number().int().optional(),
}).strict()

export const patchServiceFinalizationSchema = z.object({
    id_servico: z.number().int(),
    id_usuario_solicitante: z.number().int().optional(),
    num_saldo_horas_reajuste: z.number().int().optional(),
    num_tempo_estimado: z.number().int().optional(),
    id_usuario_prestador_list: z.array(z.number().int()).optional()
}).strict()

export const patchServiceCancelationSchema = z.object({
    id_servico: z.number().int(),
    id_usuario_solicitante: z.number().int().optional(),
    num_saldo_horas_reajuste: z.number().int().optional()
}).strict()

export const patchServiceRateSchema = z.object({
  id_servico: z.number().int(),
  avaliacao_usuario_list: z.array(
    z.object(
      {
        id_usuario: z.number().int(),
        num_nota_avaliacao: z.number().int(),
        desc_comentario_avaliacao: z.string()
      }
    )
  )
}).strict()

export type ServiceSearch = z.infer<typeof getServiceSchema>

export type ConflictServiceSearch = z.infer<typeof getConflictServiceSchema>

export type ServiceSkillsSearch = z.infer<typeof getSkillsByServiceSchema>

export type ServiceCategoriesSearch = z.infer<typeof getCategoriesByServiceSchema>

export type ServiceProviderUsersSearch = z.infer<typeof getProviderUsersByServiceSchema>

export type ServiceInput = z.infer<typeof postServiceSchema>

export type ServiceProviderUpdate = z.infer<typeof patchProvideServiceSchema>

export type ServiceFinalizationUpdate = z.infer<typeof patchServiceFinalizationSchema>

export type ServiceCancelationUpdate = z.infer<typeof patchServiceCancelationSchema>

export type ServiceRateUpdate = z.infer<typeof patchServiceRateSchema>
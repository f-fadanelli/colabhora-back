import { z } from 'zod'

export const getUserSchema = z.object({
    id_usuario: z.coerce.number().int().optional(),
    nom_usuario: z.string().optional(),
    cod_cadastro: z.string().optional(),
    cod_email_usuario: z.string().optional(),
    id_cidade: z.coerce.number().int().optional(),
    id_habilidade: z.coerce.number().int().optional()
  }).strict()

export const getSkillsByUserSchema = z.object({
    id_usuario: z.coerce.number().int()
  }).strict()

export const validateUserSchema = z.object({
    cod_email_usuario: z.string(),
    cod_senha_usuario: z.string()
  }).strict()

export const postUserSchema = z.object({
    nom_usuario: z.string(),
    cod_cadastro: z.string(),
    cod_email_usuario: z.string(),
    cod_senha_usuario: z.string(),
    id_cidade: z.number().int(),
    desc_endereco: z.string(),
    flg_tipo_usuario: z.enum(["PF", "PJ"]),
    desc_area_atuacao: z.string().optional(),
    id_habilidade_lista: z.array(z.number().int())
}).strict()

export const patchUserSchema = z.object({
    id_usuario: z.number().int(),
    nom_usuario: z.string(),
    cod_cadastro: z.string(),
    cod_email_usuario: z.string(),
    id_cidade: z.number().int(),
    desc_endereco: z.string(),
    desc_area_atuacao: z.string().optional(),
    id_habilidade_lista: z.array(z.number().int())
}).strict()

export type UserSearch = z.infer<typeof getUserSchema>

export type UserSkillsSearch = z.infer<typeof getSkillsByUserSchema>

export type UserValidate = z.infer<typeof validateUserSchema>

export type UserInput = z.infer<typeof postUserSchema>

export type UserUpdate = z.infer<typeof patchUserSchema>


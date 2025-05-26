"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/library/schemas/services.ts
var services_exports = {};
__export(services_exports, {
  getCategoriesByServiceSchema: () => getCategoriesByServiceSchema,
  getConflictServiceSchema: () => getConflictServiceSchema,
  getProviderUsersByServiceSchema: () => getProviderUsersByServiceSchema,
  getServiceSchema: () => getServiceSchema,
  getSkillsByServiceSchema: () => getSkillsByServiceSchema,
  patchProvideServiceSchema: () => patchProvideServiceSchema,
  patchServiceFinalizationSchema: () => patchServiceFinalizationSchema,
  patchServiceRateSchema: () => patchServiceRateSchema,
  postServiceSchema: () => postServiceSchema
});
module.exports = __toCommonJS(services_exports);
var import_zod = require("zod");
var getServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int().optional(),
  id_usuario_solicitante: import_zod.z.coerce.number().int().optional(),
  id_usuario_prestador: import_zod.z.coerce.number().int().optional(),
  id_usuario_busca: import_zod.z.coerce.number().int().optional(),
  id_projeto_pai: import_zod.z.coerce.number().int().optional(),
  id_cidade: import_zod.z.coerce.number().int().optional(),
  id_status: import_zod.z.coerce.number().int().optional(),
  dth_servico_low: import_zod.z.coerce.date().optional(),
  dth_servico_high: import_zod.z.coerce.date().optional(),
  dth_fim_servico_low: import_zod.z.coerce.date().optional(),
  dth_fim_servico_high: import_zod.z.coerce.date().optional(),
  id_habilidade: import_zod.z.coerce.number().int().optional(),
  id_categoria: import_zod.z.coerce.number().int().optional()
}).strict();
var getConflictServiceSchema = import_zod.z.object({
  id_usuario: import_zod.z.coerce.number().int(),
  dth_servico: import_zod.z.coerce.date(),
  dth_fim_servico: import_zod.z.coerce.date()
}).strict();
var getSkillsByServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int()
}).strict();
var getCategoriesByServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int()
}).strict();
var getProviderUsersByServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int()
}).strict();
var postServiceSchema = import_zod.z.object({
  nom_servico: import_zod.z.string(),
  desc_servico: import_zod.z.string(),
  id_usuario_solicitante: import_zod.z.number().int(),
  id_projeto_pai: import_zod.z.number().int().optional(),
  dth_servico: import_zod.z.coerce.date(),
  dth_fim_servico: import_zod.z.coerce.date(),
  num_tempo_estimado: import_zod.z.number().int().optional(),
  num_novo_saldo: import_zod.z.number().int().optional(),
  num_qtd_prestadores: import_zod.z.number().int(),
  id_habilidade_lista: import_zod.z.array(import_zod.z.number().int()),
  id_categoria_lista: import_zod.z.array(import_zod.z.number().int())
}).strict();
var patchProvideServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.number().int(),
  id_usuario_prestador: import_zod.z.number().int(),
  id_novo_status: import_zod.z.number().int().optional()
}).strict();
var patchServiceFinalizationSchema = import_zod.z.object({
  id_servico: import_zod.z.number().int(),
  id_usuario_solicitante: import_zod.z.number().int().optional(),
  num_saldo_horas_reajuste: import_zod.z.number().int().optional(),
  num_tempo_estimado: import_zod.z.number().int().optional(),
  id_usuario_prestador_list: import_zod.z.array(import_zod.z.number().int()).optional()
}).strict();
var patchServiceRateSchema = import_zod.z.object({
  id_servico: import_zod.z.number().int(),
  avaliacao_usuario_list: import_zod.z.array(
    import_zod.z.object(
      {
        id_usuario: import_zod.z.number().int(),
        num_nota_avaliacao: import_zod.z.number().int(),
        desc_comentario_avaliacao: import_zod.z.string()
      }
    )
  )
}).strict();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCategoriesByServiceSchema,
  getConflictServiceSchema,
  getProviderUsersByServiceSchema,
  getServiceSchema,
  getSkillsByServiceSchema,
  patchProvideServiceSchema,
  patchServiceFinalizationSchema,
  patchServiceRateSchema,
  postServiceSchema
});

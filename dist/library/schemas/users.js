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

// src/library/schemas/users.ts
var users_exports = {};
__export(users_exports, {
  getSkillsByUserSchema: () => getSkillsByUserSchema,
  getUserSchema: () => getUserSchema,
  patchUserSchema: () => patchUserSchema,
  postUserSchema: () => postUserSchema,
  validateUserSchema: () => validateUserSchema
});
module.exports = __toCommonJS(users_exports);
var import_zod = require("zod");
var getUserSchema = import_zod.z.object({
  id_usuario: import_zod.z.coerce.number().int().optional(),
  nom_usuario: import_zod.z.string().optional(),
  cod_cadastro: import_zod.z.string().optional(),
  cod_email_usuario: import_zod.z.string().optional(),
  id_cidade: import_zod.z.coerce.number().int().optional(),
  id_habilidade: import_zod.z.coerce.number().int().optional()
}).strict();
var getSkillsByUserSchema = import_zod.z.object({
  id_usuario: import_zod.z.coerce.number().int()
}).strict();
var validateUserSchema = import_zod.z.object({
  cod_email_usuario: import_zod.z.string(),
  cod_senha_usuario: import_zod.z.string()
}).strict();
var postUserSchema = import_zod.z.object({
  nom_usuario: import_zod.z.string(),
  cod_cadastro: import_zod.z.string(),
  cod_email_usuario: import_zod.z.string(),
  cod_senha_usuario: import_zod.z.string(),
  id_cidade: import_zod.z.number().int(),
  desc_endereco: import_zod.z.string(),
  flg_tipo_usuario: import_zod.z.enum(["PF", "PJ"]),
  desc_area_atuacao: import_zod.z.string().optional(),
  id_habilidade_lista: import_zod.z.array(import_zod.z.number().int())
}).strict();
var patchUserSchema = import_zod.z.object({
  id_usuario: import_zod.z.number().int(),
  nom_usuario: import_zod.z.string(),
  cod_cadastro: import_zod.z.string(),
  cod_email_usuario: import_zod.z.string(),
  id_cidade: import_zod.z.number().int(),
  desc_endereco: import_zod.z.string(),
  desc_area_atuacao: import_zod.z.string().optional(),
  id_habilidade_lista: import_zod.z.array(import_zod.z.number().int())
}).strict();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSkillsByUserSchema,
  getUserSchema,
  patchUserSchema,
  postUserSchema,
  validateUserSchema
});

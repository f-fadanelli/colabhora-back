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

// src/library/schemas/projects.ts
var projects_exports = {};
__export(projects_exports, {
  getProjectSchema: () => getProjectSchema,
  postProjectSchema: () => postProjectSchema
});
module.exports = __toCommonJS(projects_exports);
var import_zod = require("zod");
var getProjectSchema = import_zod.z.object({
  id_projeto: import_zod.z.coerce.number().int().optional(),
  nom_projeto: import_zod.z.string().optional(),
  id_usuario_responsavel: import_zod.z.coerce.number().int().optional(),
  dth_inicio_low: import_zod.z.coerce.date().optional(),
  dth_inicio_high: import_zod.z.coerce.date().optional(),
  dth_fim_low: import_zod.z.coerce.date().optional(),
  dth_fim_high: import_zod.z.coerce.date().optional()
}).strict();
var postProjectSchema = import_zod.z.object({
  nom_projeto: import_zod.z.string(),
  desc_projeto: import_zod.z.string(),
  id_usuario_responsavel: import_zod.z.number().int(),
  dth_inicio: import_zod.z.coerce.date(),
  dth_fim: import_zod.z.coerce.date()
}).strict();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getProjectSchema,
  postProjectSchema
});

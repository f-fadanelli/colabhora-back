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

// src/library/schemas/skills.ts
var skills_exports = {};
__export(skills_exports, {
  getSkillSchema: () => getSkillSchema,
  patchSkillSchema: () => patchSkillSchema,
  postSkillSchema: () => postSkillSchema
});
module.exports = __toCommonJS(skills_exports);
var import_zod = require("zod");
var getSkillSchema = import_zod.z.object({
  id_habilidade: import_zod.z.coerce.number().int().optional(),
  nom_habilidade: import_zod.z.string().optional()
}).strict();
var postSkillSchema = import_zod.z.object({
  nom_habilidade: import_zod.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();
var patchSkillSchema = import_zod.z.object({
  id_habilidade: import_zod.z.number().int(),
  nom_habilidade: import_zod.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSkillSchema,
  patchSkillSchema,
  postSkillSchema
});

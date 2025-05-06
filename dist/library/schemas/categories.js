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

// src/library/schemas/categories.ts
var categories_exports = {};
__export(categories_exports, {
  getCategorySchema: () => getCategorySchema,
  patchCategorySchema: () => patchCategorySchema,
  postCategorySchema: () => postCategorySchema
});
module.exports = __toCommonJS(categories_exports);
var import_zod = require("zod");
var getCategorySchema = import_zod.z.object({
  id_categoria: import_zod.z.coerce.number().int().optional(),
  nom_categoria: import_zod.z.string().optional()
}).strict();
var postCategorySchema = import_zod.z.object({
  nom_categoria: import_zod.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();
var patchCategorySchema = import_zod.z.object({
  id_categoria: import_zod.z.number().int(),
  nom_categoria: import_zod.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCategorySchema,
  patchCategorySchema,
  postCategorySchema
});

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

// src/library/schemas/cities.ts
var cities_exports = {};
__export(cities_exports, {
  getCitySchema: () => getCitySchema
});
module.exports = __toCommonJS(cities_exports);
var import_zod = require("zod");
var getCitySchema = import_zod.z.object({
  id_cidade: import_zod.z.coerce.number().int().optional(),
  nom_cidade: import_zod.z.string().optional(),
  id_estado: import_zod.z.coerce.number().int().optional()
}).strict();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCitySchema
});

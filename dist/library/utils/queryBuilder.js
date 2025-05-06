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

// src/library/utils/queryBuilder.ts
var queryBuilder_exports = {};
__export(queryBuilder_exports, {
  buildWhereClause: () => buildWhereClause
});
module.exports = __toCommonJS(queryBuilder_exports);
var buildWhereClause = (filters) => {
  const conditions = [];
  const values = [];
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== void 0 && value !== null) {
      values.push(value);
      conditions.push(`${key} = $${values.length}`);
    }
  });
  const clause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
  return { clause, values };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildWhereClause
});

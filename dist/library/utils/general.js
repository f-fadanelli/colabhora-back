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

// src/library/utils/general.ts
var general_exports = {};
__export(general_exports, {
  arraysNumericosIguais: () => arraysNumericosIguais,
  decimalParaHorasEMinutos: () => decimalParaHorasEMinutos
});
module.exports = __toCommonJS(general_exports);
var arraysNumericosIguais = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((valor, indice) => valor === arr2[indice]);
};
var decimalParaHorasEMinutos = (decimal) => {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  let resultado = `${horas}h`;
  if (minutos !== 0) {
    resultado += ` ${minutos}min`;
  }
  return resultado;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arraysNumericosIguais,
  decimalParaHorasEMinutos
});

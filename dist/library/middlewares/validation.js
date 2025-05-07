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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/library/middlewares/validation.ts
var validation_exports = {};
__export(validation_exports, {
  validate: () => validate
});
module.exports = __toCommonJS(validation_exports);

// src/library/utils/http-response.ts
var badRequest = (message) => __async(null, null, function* () {
  return {
    statusCode: 400,
    body: { error: message }
  };
});

// src/library/middlewares/validation.ts
var validate = (schema, location) => {
  return (req, res, next) => __async(null, null, function* () {
    const dataToValidate = req[location];
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      const response = yield badRequest(result.error.flatten());
      res.status(response.statusCode).json(response.body);
      return;
    }
    if (!req.validated) {
      req.validated = {};
    }
    req.validated[location] = result.data;
    next();
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validate
});

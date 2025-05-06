"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/library/utils/authentication.ts
var authentication_exports = {};
__export(authentication_exports, {
  authenticateToken: () => authenticateToken
});
module.exports = __toCommonJS(authentication_exports);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/library/utils/http-response.ts
var unauthorized = () => __async(null, null, function* () {
  return {
    statusCode: 401,
    body: { error: "Authentication token is missing!" }
  };
});
var forbidden = () => __async(null, null, function* () {
  return {
    statusCode: 403,
    body: { error: "Not authorized!" }
  };
});

// src/library/utils/authentication.ts
var JWT_SECRET = process.env.JWT_SECRET || "meu_secret";
function authenticateToken(role) {
  return (req, res, next) => __async(null, null, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let response;
    if (!token) {
      response = yield unauthorized();
      res.status(response.statusCode).json(response.body);
      return;
    }
    import_jsonwebtoken.default.verify(token, JWT_SECRET, (err, decoded) => __async(null, null, function* () {
      if (err) {
        response = yield forbidden();
        res.status(response.statusCode).json(response.body);
        return;
      }
      const user = decoded;
      if (role === "admin" && (user == null ? void 0 : user.flg_tipo_usuario) !== "AD") {
        response = yield forbidden();
        res.status(response.statusCode).json(response.body);
        return;
      }
      req.user = user;
      next();
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateToken
});

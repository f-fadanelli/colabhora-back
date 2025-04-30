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

// src/api/routes/routes.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

// src/library/database/postgressql.ts
var import_pg = require("pg");
var user = process.env.POSTGRES_USER;
var host = process.env.POSTGRES_HOST;
var database = process.env.POSTGRES_DATABASE;
var password = process.env.POSTGRES_PASSWORD;
var pool = new import_pg.Pool({
  connectionString: `postgres://${user}:${password}@${host}/${database}?sslmode=require`,
  idleTimeoutMillis: 3e3
});
var poolPromise = pool.connect().then((pool2) => {
  console.log("Connected to Postgtresql");
  return pool2;
}).catch((err) => {
  console.error("Connection failed! Bad config:", err);
  throw err;
});
var postgressql_default = poolPromise;

// src/library/repositories/users.ts
var findAllUsers = () => __async(null, null, function* () {
  let result;
  const client = yield postgressql_default;
  result = yield client.query(`SELECT * FROM TB_USUARIO`);
  return result.rows;
});

// src/library/utils/http-response.ts
var ok = (data) => __async(null, null, function* () {
  return {
    statusCode: 200,
    body: data
  };
});
var noContent = () => __async(null, null, function* () {
  return {
    statusCode: 204,
    body: null
  };
});

// src/api/services/users.ts
var getUserService = () => __async(null, null, function* () {
  const data = yield findAllUsers();
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});

// src/api/controllers/users.ts
var getUsers = (req, res) => __async(null, null, function* () {
  const response = yield getUserService();
  res.status(response.statusCode).json(response.body);
});

// src/api/routes/users.ts
function users_default(router2) {
  router2.get("/users", getUsers);
}

// src/library/repositories/categories.ts
var findAllCategories = () => __async(null, null, function* () {
  let result;
  const client = yield postgressql_default;
  result = yield client.query(`SELECT * FROM TB_CATEGORIA`);
  return result.rows;
});

// src/api/services/categories.ts
var getCategoryService = () => __async(null, null, function* () {
  const data = yield findAllCategories();
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});

// src/api/controllers/categories.ts
var getCategories = (req, res) => __async(null, null, function* () {
  const response = yield getCategoryService();
  res.status(response.statusCode).json(response.body);
});

// src/api/routes/categories.ts
function categories_default(router2) {
  router2.get("/categories", getCategories);
}

// src/api/routes/routes.ts
var router = (0, import_express.Router)();
users_default(router);
categories_default(router);
var routes_default = router;

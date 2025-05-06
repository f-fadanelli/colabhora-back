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

// src/library/repositories/categories.ts
var categories_exports = {};
__export(categories_exports, {
  findAllCategories: () => findAllCategories,
  insertCategory: () => insertCategory,
  updateCategory: () => updateCategory
});
module.exports = __toCommonJS(categories_exports);

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

// src/library/utils/queryBuilder.ts
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

// src/library/repositories/categories.ts
var findAllCategories = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  const { clause, values } = buildWhereClause(filter);
  const query = `SELECT * FROM TB_CATEGORIA ${clause} ORDER BY ID_CATEGORIA DESC`;
  result = yield client.query(query, values);
  return result.rows;
});
var insertCategory = (category) => __async(null, null, function* () {
  var _a;
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { nom_categoria } = category;
    const insertQuery = `
            INSERT INTO TB_CATEGORIA (nom_categoria)
            VALUES ($1)
            RETURNING id_categoria;
        `;
    const values = [nom_categoria];
    const result = yield client.query(insertQuery, values);
    const id = (_a = result.rows[0]) == null ? void 0 : _a.id_categoria;
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Categoria inserida com sucesso",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao inserir categoria",
      error: err.message
    };
  }
});
var updateCategory = (category) => __async(null, null, function* () {
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { nom_categoria, id_categoria } = category;
    const updateQuery = `
            UPDATE TB_CATEGORIA SET NOM_CATEGORIA = $1
                WHERE ID_CATEGORIA = $2
        `;
    const values = [nom_categoria, id_categoria];
    yield client.query(updateQuery, values);
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Categoria atualizada com sucesso",
      id: id_categoria
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao atualizar categoria",
      error: err.message
    };
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findAllCategories,
  insertCategory,
  updateCategory
});

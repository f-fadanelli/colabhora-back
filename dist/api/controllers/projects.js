"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// src/api/controllers/projects.ts
var projects_exports = {};
__export(projects_exports, {
  getProjects: () => getProjects,
  postProject: () => postProject
});
module.exports = __toCommonJS(projects_exports);

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

// src/library/repositories/projects.ts
var findAllProjects = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  let _a = filter, { dth_inicio_low, dth_inicio_high, dth_fim_low, dth_fim_high } = _a, newFilter = __objRest(_a, ["dth_inicio_low", "dth_inicio_high", "dth_fim_low", "dth_fim_high"]);
  let { clause, values } = buildWhereClause(newFilter);
  if (dth_inicio_low || dth_inicio_high) {
    const lowDate = dth_inicio_low ? dth_inicio_low : dth_inicio_high ? dth_inicio_high : (/* @__PURE__ */ new Date()).toISOString();
    const highDate = dth_inicio_high ? dth_inicio_high : dth_inicio_low ? dth_inicio_low : (/* @__PURE__ */ new Date()).toISOString();
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} DTH_INICIO BETWEEN $${values.length + 1} AND $${values.length + 2} `;
    values.push(lowDate);
    values.push(highDate);
  }
  if (dth_fim_low || dth_fim_high) {
    const lowDate = dth_fim_low ? dth_fim_low : dth_fim_high ? dth_fim_high : (/* @__PURE__ */ new Date()).toISOString();
    const highDate = dth_fim_high ? dth_fim_high : dth_fim_low ? dth_fim_low : (/* @__PURE__ */ new Date()).toISOString();
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} DTH_FIM BETWEEN $${values.length + 1} AND $${values.length + 2} `;
    values.push(lowDate);
    values.push(highDate);
  }
  const query = `SELECT * FROM VW_PROJETO ${clause} ORDER BY ID_PROJETO DESC`;
  result = yield client.query(query, values);
  return result.rows;
});
var insertProject = (project) => __async(null, null, function* () {
  var _a;
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { nom_projeto, desc_projeto, id_usuario_responsavel, dth_inicio, dth_fim } = project;
    const insertQuery = `
            INSERT INTO TB_PROJETO (nom_projeto, desc_projeto, id_usuario_responsavel, dth_inicio, dth_fim)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_projeto;
        `;
    const values = [nom_projeto, desc_projeto, id_usuario_responsavel, dth_inicio, dth_fim];
    const result = yield client.query(insertQuery, values);
    const id = (_a = result.rows[0]) == null ? void 0 : _a.id_projeto;
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Projeto inserido com sucesso",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao criar projeto",
      error: err.message
    };
  }
});

// src/library/repositories/users.ts
var findAllUsers = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  let _a = filter, { id_habilidade } = _a, newFilter = __objRest(_a, ["id_habilidade"]);
  let { clause, values } = buildWhereClause(newFilter);
  if (id_habilidade) {
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} ID_USUARIO IN (SELECT DISTINCT(ID_USUARIO) FROM TB_USUARIO_HABILIDADE WHERE ID_HABILIDADE = $${values.length + 1} ) `;
    values.push(id_habilidade);
  }
  const query = `SELECT * FROM VW_USUARIO ${clause} ORDER BY ID_USUARIO DESC`;
  result = yield client.query(query, values);
  return result.rows;
});

// src/library/utils/http-response.ts
var ok = (data) => __async(null, null, function* () {
  return {
    statusCode: 200,
    body: { result: data }
  };
});
var created = (id) => __async(null, null, function* () {
  return {
    statusCode: 201,
    body: { message: "Sucess!", generated_id: id }
  };
});
var noContent = () => __async(null, null, function* () {
  return {
    statusCode: 204,
    body: null
  };
});
var badRequest = (message) => __async(null, null, function* () {
  return {
    statusCode: 400,
    body: { error: message }
  };
});

// src/api/services/projects.ts
var getProjectService = (filter) => __async(null, null, function* () {
  const data = yield findAllProjects(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var postProjectService = (project) => __async(null, null, function* () {
  const data = yield findAllUsers({ "id_usuario": project.id_usuario_responsavel });
  let response;
  if (data.length > 0) {
    const user2 = data[0];
    if (user2.flg_tipo_usuario != "PJ") {
      response = yield badRequest("Usu\xE1rio deve ser do tipo PJ!");
    } else {
      const result = yield insertProject(project);
      if (result.success) {
        response = yield created(result.id);
      } else
        response = yield badRequest(result.message);
    }
  } else {
    response = yield badRequest("Usu\xE1rio inv\xE1lido!");
  }
  return response;
});

// src/api/controllers/projects.ts
var getProjects = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getProjectService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var postProject = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield postProjectService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getProjects,
  postProject
});

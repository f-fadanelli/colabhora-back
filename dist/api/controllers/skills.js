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

// src/api/controllers/skills.ts
var skills_exports = {};
__export(skills_exports, {
  getSkills: () => getSkills,
  patchSkillById: () => patchSkillById,
  postSkill: () => postSkill
});
module.exports = __toCommonJS(skills_exports);

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

// src/library/repositories/skills.ts
var findAllSkills = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  const { clause, values } = buildWhereClause(filter);
  const query = `SELECT * FROM TB_HABILIDADE ${clause} ORDER BY ID_HABILIDADE DESC`;
  result = yield client.query(query, values);
  return result.rows;
});
var insertSkill = (skill) => __async(null, null, function* () {
  var _a;
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { nom_habilidade } = skill;
    const insertQuery = `
            INSERT INTO TB_HABILIDADE (nom_habilidade)
            VALUES ($1)
            RETURNING id_habilidade;
        `;
    const values = [nom_habilidade];
    const result = yield client.query(insertQuery, values);
    const id = (_a = result.rows[0]) == null ? void 0 : _a.id_habilidade;
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Habilidade inserida com sucesso",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao inserir habilidade",
      error: err.message
    };
  }
});
var updateSkill = (skill) => __async(null, null, function* () {
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { nom_habilidade, id_habilidade } = skill;
    const updateQuery = `
            UPDATE TB_HABILIDADE SET NOM_HABILIDADE = $1
                WHERE ID_HABILIDADE = $2
        `;
    const values = [nom_habilidade, id_habilidade];
    yield client.query(updateQuery, values);
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Habilidade atualizada com sucesso",
      id: id_habilidade
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao atualizar habilidade",
      error: err.message
    };
  }
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

// src/api/services/skills.ts
var getSkillService = (filter) => __async(null, null, function* () {
  const data = yield findAllSkills(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var postSkillService = (skill) => __async(null, null, function* () {
  const data = yield findAllSkills({ "nom_habilidade": skill.nom_habilidade });
  let response;
  if (data.length > 0) {
    response = yield badRequest("Habilidade com o nome informado j\xE1 foi cadastrada!");
  } else {
    const result = yield insertSkill(skill);
    if (result.success) {
      response = yield created(result.id);
    } else
      response = yield badRequest(result.message);
  }
  return response;
});
var patchSkillByIdService = (skill) => __async(null, null, function* () {
  const data = yield findAllSkills({ "nom_habilidade": skill.nom_habilidade });
  let response;
  if (data.length > 0 && data[0].id_habilidade != skill.id_habilidade) {
    response = yield badRequest("Habilidade com o nome informado j\xE1 foi cadastrada!");
  } else {
    const result = yield updateSkill(skill);
    if (result.success) {
      response = yield ok(result.message);
    } else
      response = yield badRequest(result.message);
  }
  return response;
});

// src/api/controllers/skills.ts
var getSkills = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getSkillService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var postSkill = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield postSkillService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var patchSkillById = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchSkillByIdService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSkills,
  patchSkillById,
  postSkill
});

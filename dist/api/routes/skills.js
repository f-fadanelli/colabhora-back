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

// src/api/routes/skills.ts
var skills_exports = {};
__export(skills_exports, {
  default: () => skills_default
});
module.exports = __toCommonJS(skills_exports);

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

// src/library/utils/validation.ts
var validate = (schema, location) => {
  return (req, res, next) => __async(null, null, function* () {
    const dataToValidate = req[location];
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      const response = yield badRequest(result.error.flatten());
      res.status(response.statusCode).json(response.body);
      return;
    }
    req[location] = result.data;
    next();
  });
};

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
  const response = yield getSkillService(req.query);
  res.status(response.statusCode).json(response.body);
});
var postSkill = (req, res) => __async(null, null, function* () {
  const response = yield postSkillService(req.body);
  res.status(response.statusCode).json(response.body);
});
var patchSkillById = (req, res) => __async(null, null, function* () {
  const response = yield patchSkillByIdService(req.body);
  res.status(response.statusCode).json(response.body);
});

// src/library/schemas/skills.ts
var import_zod = require("zod");
var getSkillSchema = import_zod.z.object({
  id_habilidade: import_zod.z.coerce.number().int().optional(),
  nom_habilidade: import_zod.z.string().optional()
}).strict();
var postSkillSchema = import_zod.z.object({
  nom_habilidade: import_zod.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();
var patchSkillSchema = import_zod.z.object({
  id_habilidade: import_zod.z.number().int(),
  nom_habilidade: import_zod.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();

// src/library/utils/authentication.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
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
      const user2 = decoded;
      if (role === "admin" && (user2 == null ? void 0 : user2.flg_tipo_usuario) !== "AD") {
        response = yield forbidden();
        res.status(response.statusCode).json(response.body);
        return;
      }
      req.user = user2;
      next();
    }));
  });
}

// src/api/routes/skills.ts
function skills_default(router) {
  router.get("/skill", validate(getSkillSchema, "query"), authenticateToken("default"), getSkills);
  router.post("/skill", validate(postSkillSchema, "body"), authenticateToken("admin"), postSkill);
  router.patch("/skill", validate(patchSkillSchema, "body"), authenticateToken("admin"), patchSkillById);
}

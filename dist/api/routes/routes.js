"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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

// src/api/routes/routes.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

// src/api/services/users.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

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
var findUserSkills = (filter) => __async(null, null, function* () {
  let result;
  const client = yield postgressql_default;
  let { id_usuario } = filter;
  const values = [id_usuario];
  result = yield client.query(`SELECT * FROM VW_USUARIO_HABILIDADE  
                                WHERE ID_USUARIO = $1`, values);
  return result.rows;
});
var insertUser = (user2) => __async(null, null, function* () {
  var _a;
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { nom_usuario, cod_cadastro, cod_email_usuario, cod_senha_usuario, id_cidade, desc_endereco, flg_tipo_usuario, desc_area_atuacao, id_habilidade_lista } = user2;
    const insertQuery = `
            INSERT INTO TB_USUARIO (nom_usuario, cod_cadastro, cod_email_usuario, cod_senha_usuario, num_saldo_horas, id_cidade, desc_endereco, flg_tipo_usuario, desc_area_atuacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_usuario;
        `;
    const initialBalance = 10;
    const values = [nom_usuario, cod_cadastro, cod_email_usuario, cod_senha_usuario, initialBalance, id_cidade, desc_endereco, flg_tipo_usuario, desc_area_atuacao];
    const result = yield client.query(insertQuery, values);
    const id = (_a = result.rows[0]) == null ? void 0 : _a.id_usuario;
    for (const id_habilidade of id_habilidade_lista) {
      yield client.query(`INSERT INTO TB_USUARIO_HABILIDADE(id_usuario, id_habilidade) VALUES($1, $2)`, [id, id_habilidade]);
    }
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Usu\xE1rio inserido com sucesso",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao inserir usu\xE1rio",
      error: err.message
    };
  }
});
var updateUser = (user2) => __async(null, null, function* () {
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { id_usuario, nom_usuario, cod_cadastro, cod_email_usuario, id_cidade, desc_endereco, desc_area_atuacao, id_habilidade_lista } = user2;
    const skills = yield findUserSkills({ id_usuario });
    let current_skills_list = [];
    for (const skill of skills) {
      current_skills_list.push(skill["id_habilidade"]);
    }
    let new_skills = id_habilidade_lista.filter((skl) => !current_skills_list.includes(skl));
    let deleted_skills = current_skills_list.filter((skl) => !id_habilidade_lista.includes(skl));
    for (const id_habilidade of new_skills) {
      yield client.query(`INSERT INTO TB_USUARIO_HABILIDADE(id_usuario, id_habilidade) VALUES($1, $2)`, [id_usuario, id_habilidade]);
    }
    for (const id_habilidade of deleted_skills) {
      yield client.query(`DELETE FROM TB_USUARIO_HABILIDADE WHERE id_usuario = $1 AND id_habilidade = $2`, [id_usuario, id_habilidade]);
    }
    const updateQuery = `
            UPDATE TB_USUARIO SET NOM_USUARIO = $1,
                                COD_CADASTRO = $2,
                                COD_EMAIL_USUARIO = $3,
                                ID_CIDADE = $4,
                                DESC_ENDERECO = $5,
                                DESC_AREA_ATUACAO = $6
                WHERE ID_USUARIO = $7
        `;
    const values = [nom_usuario, cod_cadastro, cod_email_usuario, id_cidade, desc_endereco, desc_area_atuacao, id_usuario];
    yield client.query(updateQuery, values);
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Usu\xE1rio atualizado com sucesso",
      id: id_usuario
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao atualizar usu\xE1rio",
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

// src/api/services/users.ts
var JWT_SECRET = process.env.JWT_SECRET || "meu_secret";
var getUserService = (filter) => __async(null, null, function* () {
  let data = yield findAllUsers(filter);
  let response;
  if (data.length > 0) {
    data.forEach((elem) => {
      delete elem["cod_senha_usuario"];
    });
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getUserSkillsService = (filter) => __async(null, null, function* () {
  let data = yield findUserSkills(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var validateUserLoginService = (user2) => __async(null, null, function* () {
  const data = yield findAllUsers({ "cod_email_usuario": user2.cod_email_usuario });
  let response;
  if (data) {
    const foundUser = data[0];
    const valid = yield import_bcrypt.default.compare(user2.cod_senha_usuario, foundUser.cod_senha_usuario);
    if (!valid)
      response = yield badRequest("Invalid Credentials");
    else {
      const token = import_jsonwebtoken.default.sign({ id_usuario: foundUser.id_usuario, flg_tipo_usuario: foundUser.flg_tipo_usuario }, JWT_SECRET, { expiresIn: "2h" });
      response = yield ok({ token });
    }
  } else {
    response = yield badRequest("Invalid Credentials");
  }
  return response;
});
var postUserService = (user2) => __async(null, null, function* () {
  const data = yield findAllUsers({ "cod_email_usuario": user2.cod_email_usuario });
  let response;
  if (data.length > 0) {
    response = yield badRequest("Usuario com o email informado j\xE1 foi cadastrado!");
  } else {
    const hashedPassword = yield import_bcrypt.default.hash(user2.cod_senha_usuario, 10);
    user2["cod_senha_usuario"] = hashedPassword;
    const result = yield insertUser(user2);
    if (result.success) {
      response = yield created(result.id);
    } else
      response = yield badRequest(result.message);
  }
  return response;
});
var patchUserByIdService = (user2) => __async(null, null, function* () {
  const data = yield findAllUsers({ "cod_email_usuario": user2.cod_email_usuario });
  let response;
  if (data.length > 0 && data[0].id_usuario != user2.id_usuario) {
    response = yield badRequest("Usuario com o nome informado j\xE1 foi cadastrada!");
  } else {
    const result = yield updateUser(user2);
    if (result.success) {
      response = yield ok(result.message);
    } else
      response = yield badRequest(result.message);
  }
  return response;
});

// src/api/controllers/users.ts
var getUsers = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getUserService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var getUserSkills = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getUserSkillsService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var postUserLogin = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield validateUserLoginService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var postUser = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield postUserService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var patchUserById = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchUserByIdService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});

// src/library/schemas/users.ts
var import_zod = require("zod");
var getUserSchema = import_zod.z.object({
  id_usuario: import_zod.z.coerce.number().int().optional(),
  nom_usuario: import_zod.z.string().optional(),
  cod_cadastro: import_zod.z.string().optional(),
  cod_email_usuario: import_zod.z.string().optional(),
  id_cidade: import_zod.z.coerce.number().int().optional(),
  id_habilidade: import_zod.z.coerce.number().int().optional()
}).strict();
var getSkillsByUserSchema = import_zod.z.object({
  id_usuario: import_zod.z.coerce.number().int()
}).strict();
var validateUserSchema = import_zod.z.object({
  cod_email_usuario: import_zod.z.string(),
  cod_senha_usuario: import_zod.z.string()
}).strict();
var postUserSchema = import_zod.z.object({
  nom_usuario: import_zod.z.string(),
  cod_cadastro: import_zod.z.string(),
  cod_email_usuario: import_zod.z.string(),
  cod_senha_usuario: import_zod.z.string(),
  id_cidade: import_zod.z.number().int(),
  desc_endereco: import_zod.z.string(),
  flg_tipo_usuario: import_zod.z.enum(["PF", "PJ"]),
  desc_area_atuacao: import_zod.z.string().optional(),
  id_habilidade_lista: import_zod.z.array(import_zod.z.number().int())
}).strict();
var patchUserSchema = import_zod.z.object({
  id_usuario: import_zod.z.number().int(),
  nom_usuario: import_zod.z.string(),
  cod_cadastro: import_zod.z.string(),
  cod_email_usuario: import_zod.z.string(),
  id_cidade: import_zod.z.number().int(),
  desc_endereco: import_zod.z.string(),
  desc_area_atuacao: import_zod.z.string().optional(),
  id_habilidade_lista: import_zod.z.array(import_zod.z.number().int())
}).strict();

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
    if (!req.validated) {
      req.validated = {};
    }
    req.validated[location] = result.data;
    next();
  });
};

// src/library/utils/authentication.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var JWT_SECRET2 = process.env.JWT_SECRET || "meu_secret";
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
    import_jsonwebtoken2.default.verify(token, JWT_SECRET2, (err, decoded) => __async(null, null, function* () {
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

// src/api/routes/users.ts
function users_default(router2) {
  router2.post("/user/validate", validate(validateUserSchema, "body"), postUserLogin), router2.get("/user", validate(getUserSchema, "query"), authenticateToken("default"), getUsers), router2.get("/user/skills", validate(getSkillsByUserSchema, "query"), authenticateToken("default"), getUserSkills), router2.post("/user", validate(postUserSchema, "body"), postUser);
  router2.patch("/user", validate(patchUserSchema, "body"), authenticateToken("default"), patchUserById);
}

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

// src/api/services/categories.ts
var getCategoryService = (filter) => __async(null, null, function* () {
  const data = yield findAllCategories(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var postCategoryService = (category) => __async(null, null, function* () {
  const data = yield findAllCategories({ "nom_categoria": category.nom_categoria });
  let response;
  if (data.length > 0) {
    response = yield badRequest("Categoria com o nome informado j\xE1 foi cadastrada!");
  } else {
    const result = yield insertCategory(category);
    if (result.success) {
      response = yield created(result.id);
    } else
      response = yield badRequest(result.message);
  }
  return response;
});
var patchCategoryByIdService = (category) => __async(null, null, function* () {
  const data = yield findAllCategories({ "nom_categoria": category.nom_categoria });
  let response;
  if (data.length > 0 && data[0].id_categoria != category.id_categoria) {
    response = yield badRequest("Categoria com o nome informado j\xE1 foi cadastrada!");
  } else {
    const result = yield updateCategory(category);
    if (result.success) {
      response = yield ok(result.message);
    } else
      response = yield badRequest(result.message);
  }
  return response;
});

// src/api/controllers/categories.ts
var getCategories = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getCategoryService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var postCategory = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield postCategoryService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var patchCategoryById = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchCategoryByIdService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});

// src/library/schemas/categories.ts
var import_zod2 = require("zod");
var getCategorySchema = import_zod2.z.object({
  id_categoria: import_zod2.z.coerce.number().int().optional(),
  nom_categoria: import_zod2.z.string().optional()
}).strict();
var postCategorySchema = import_zod2.z.object({
  nom_categoria: import_zod2.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();
var patchCategorySchema = import_zod2.z.object({
  id_categoria: import_zod2.z.number().int(),
  nom_categoria: import_zod2.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();

// src/api/routes/categories.ts
function categories_default(router2) {
  router2.get("/category", validate(getCategorySchema, "query"), authenticateToken("default"), getCategories);
  router2.post("/category", validate(postCategorySchema, "body"), authenticateToken("admin"), postCategory);
  router2.patch("/category", validate(patchCategorySchema, "body"), authenticateToken("admin"), patchCategoryById);
}

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

// src/library/schemas/skills.ts
var import_zod3 = require("zod");
var getSkillSchema = import_zod3.z.object({
  id_habilidade: import_zod3.z.coerce.number().int().optional(),
  nom_habilidade: import_zod3.z.string().optional()
}).strict();
var postSkillSchema = import_zod3.z.object({
  nom_habilidade: import_zod3.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();
var patchSkillSchema = import_zod3.z.object({
  id_habilidade: import_zod3.z.number().int(),
  nom_habilidade: import_zod3.z.string().min(1, "\xC9 obrigat\xF3rio")
}).strict();

// src/api/routes/skills.ts
function skills_default(router2) {
  router2.get("/skill", validate(getSkillSchema, "query"), authenticateToken("default"), getSkills);
  router2.post("/skill", validate(postSkillSchema, "body"), authenticateToken("admin"), postSkill);
  router2.patch("/skill", validate(patchSkillSchema, "body"), authenticateToken("admin"), patchSkillById);
}

// src/api/routes/routes.ts
var router = (0, import_express.Router)();
users_default(router);
categories_default(router);
skills_default(router);
var routes_default = router;

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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  Server: () => Server
});
module.exports = __toCommonJS(app_exports);
var import_express2 = __toESM(require("express"));

// src/api/routes/routes.ts
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

// src/library/middlewares/authentication.ts
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
  router2.get("/skill", validate(getSkillSchema, "query"), getSkills);
  router2.post("/skill", validate(postSkillSchema, "body"), authenticateToken("admin"), postSkill);
  router2.patch("/skill", validate(patchSkillSchema, "body"), authenticateToken("admin"), patchSkillById);
}

// src/library/schemas/cities.ts
var import_zod4 = require("zod");
var getCitySchema = import_zod4.z.object({
  id_cidade: import_zod4.z.coerce.number().int().optional(),
  nom_cidade: import_zod4.z.string().optional(),
  id_estado: import_zod4.z.coerce.number().int().optional()
}).strict();

// src/library/repositories/cities.ts
var findAllCities = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  const { clause, values } = buildWhereClause(filter);
  const query = `SELECT * FROM TB_CIDADE ${clause} ORDER BY NOM_CIDADE`;
  result = yield client.query(query, values);
  return result.rows;
});

// src/api/services/cities.ts
var getCityService = (filter) => __async(null, null, function* () {
  const data = yield findAllCities(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});

// src/api/controllers/cities.ts
var getCities = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getCityService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});

// src/api/routes/cities.ts
function cities_default(router2) {
  router2.get("/city", validate(getCitySchema, "query"), getCities);
}

// src/library/schemas/states.ts
var import_zod5 = require("zod");
var getStateSchema = import_zod5.z.object({
  id_estado: import_zod5.z.coerce.number().int().optional(),
  nom_estado: import_zod5.z.string().optional(),
  cod_uf_estado: import_zod5.z.string().optional()
}).strict();

// src/library/repositories/states.ts
var findAllStates = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  const { clause, values } = buildWhereClause(filter);
  const query = `SELECT * FROM TB_ESTADO ${clause} ORDER BY NOM_ESTADO`;
  result = yield client.query(query, values);
  return result.rows;
});

// src/api/services/states.ts
var getStateService = (filter) => __async(null, null, function* () {
  const data = yield findAllStates(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});

// src/api/controllers/states.ts
var getStates = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getStateService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});

// src/api/routes/states.ts
function states_default(router2) {
  router2.get("/state", validate(getStateSchema, "query"), getStates);
}

// src/library/schemas/status.ts
var import_zod6 = require("zod");
var getStatusSchema = import_zod6.z.object({
  id_status: import_zod6.z.coerce.number().int().optional(),
  nom_status: import_zod6.z.string().optional()
}).strict();

// src/library/repositories/status.ts
var findAllStatus = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  const { clause, values } = buildWhereClause(filter);
  const query = `SELECT * FROM TB_STATUS ${clause} ORDER BY ID_STATUS`;
  result = yield client.query(query, values);
  return result.rows;
});

// src/api/services/status.ts
var getStatusService = (filter) => __async(null, null, function* () {
  const data = yield findAllStatus(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});

// src/api/controllers/status.ts
var getStatus = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getStatusService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});

// src/api/routes/status.ts
function status_default(router2) {
  router2.get("/status", validate(getStatusSchema, "query"), authenticateToken("default"), getStatus);
}

// src/library/schemas/services.ts
var import_zod7 = require("zod");
var getServiceSchema = import_zod7.z.object({
  id_servico: import_zod7.z.coerce.number().int().optional(),
  id_usuario_solicitante: import_zod7.z.coerce.number().int().optional(),
  id_usuario_prestador: import_zod7.z.coerce.number().int().optional(),
  id_usuario_busca: import_zod7.z.coerce.number().int().optional(),
  id_projeto_pai: import_zod7.z.coerce.number().int().optional(),
  id_cidade: import_zod7.z.coerce.number().int().optional(),
  id_status: import_zod7.z.coerce.number().int().optional(),
  dth_servico_low: import_zod7.z.coerce.date().optional(),
  dth_servico_high: import_zod7.z.coerce.date().optional(),
  dth_fim_servico_low: import_zod7.z.coerce.date().optional(),
  dth_fim_servico_high: import_zod7.z.coerce.date().optional(),
  id_habilidade: import_zod7.z.coerce.number().int().optional(),
  id_categoria: import_zod7.z.coerce.number().int().optional()
}).strict();
var getConflictServiceSchema = import_zod7.z.object({
  id_usuario: import_zod7.z.coerce.number().int(),
  dth_servico: import_zod7.z.coerce.date(),
  dth_fim_servico: import_zod7.z.coerce.date()
}).strict();
var getSkillsByServiceSchema = import_zod7.z.object({
  id_servico: import_zod7.z.coerce.number().int()
}).strict();
var getCategoriesByServiceSchema = import_zod7.z.object({
  id_servico: import_zod7.z.coerce.number().int()
}).strict();
var getProviderUsersByServiceSchema = import_zod7.z.object({
  id_servico: import_zod7.z.coerce.number().int()
}).strict();
var postServiceSchema = import_zod7.z.object({
  nom_servico: import_zod7.z.string(),
  desc_servico: import_zod7.z.string(),
  id_usuario_solicitante: import_zod7.z.number().int(),
  id_projeto_pai: import_zod7.z.number().int().optional(),
  dth_servico: import_zod7.z.coerce.date(),
  dth_fim_servico: import_zod7.z.coerce.date(),
  num_tempo_estimado: import_zod7.z.number().int().optional(),
  num_novo_saldo: import_zod7.z.number().int().optional(),
  num_qtd_prestadores: import_zod7.z.number().int(),
  id_habilidade_lista: import_zod7.z.array(import_zod7.z.number().int()),
  id_categoria_lista: import_zod7.z.array(import_zod7.z.number().int())
}).strict();
var patchProvideServiceSchema = import_zod7.z.object({
  id_servico: import_zod7.z.number().int(),
  id_usuario_prestador: import_zod7.z.number().int(),
  id_novo_status: import_zod7.z.number().int().optional()
}).strict();
var patchServiceFinalizationSchema = import_zod7.z.object({
  id_servico: import_zod7.z.number().int(),
  id_usuario_solicitante: import_zod7.z.number().int().optional(),
  num_saldo_horas_reajuste: import_zod7.z.number().int().optional(),
  num_tempo_estimado: import_zod7.z.number().int().optional(),
  id_usuario_prestador_list: import_zod7.z.array(import_zod7.z.number().int()).optional()
}).strict();
var patchServiceRateSchema = import_zod7.z.object({
  id_servico: import_zod7.z.number().int(),
  avaliacao_usuario_list: import_zod7.z.array(
    import_zod7.z.object(
      {
        id_usuario: import_zod7.z.number().int(),
        num_nota_avaliacao: import_zod7.z.number().int(),
        desc_comentario_avaliacao: import_zod7.z.string()
      }
    )
  )
}).strict();

// src/library/enums/status.ts
var StatusEnum = Object.freeze({
  PENDING: 5,
  PARCIAL_ACCEPTED: 6,
  TOTAL_ACCEPTED: 7,
  DONE: 8,
  CANCELED: 9
});
var status_default2 = StatusEnum;

// src/library/repositories/services.ts
var findAllServices = (..._0) => __async(null, [..._0], function* (filter = {}) {
  let result;
  const client = yield postgressql_default;
  let _a = filter, { id_habilidade, id_categoria, id_usuario_prestador, id_usuario_busca, dth_servico_high, dth_servico_low, dth_fim_servico_low, dth_fim_servico_high } = _a, newFilter = __objRest(_a, ["id_habilidade", "id_categoria", "id_usuario_prestador", "id_usuario_busca", "dth_servico_high", "dth_servico_low", "dth_fim_servico_low", "dth_fim_servico_high"]);
  let { clause, values } = buildWhereClause(newFilter);
  if (dth_servico_low || dth_servico_high) {
    const lowDate = dth_servico_low ? dth_servico_low : dth_servico_high ? dth_servico_high : (/* @__PURE__ */ new Date()).toISOString();
    const highDate = dth_servico_high ? dth_servico_high : dth_servico_low ? dth_servico_low : (/* @__PURE__ */ new Date()).toISOString();
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} DTH_SERVICO BETWEEN $${values.length + 1} AND $${values.length + 2} `;
    values.push(lowDate);
    values.push(highDate);
  }
  if (dth_fim_servico_low || dth_fim_servico_high) {
    const lowDate = dth_fim_servico_low ? dth_fim_servico_low : dth_fim_servico_high ? dth_fim_servico_high : (/* @__PURE__ */ new Date()).toISOString();
    const highDate = dth_fim_servico_high ? dth_fim_servico_high : dth_fim_servico_low ? dth_fim_servico_low : (/* @__PURE__ */ new Date()).toISOString();
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} DTH_FIM_SERVICO BETWEEN $${values.length + 1} AND $${values.length + 2} `;
    values.push(lowDate);
    values.push(highDate);
  }
  if (id_habilidade) {
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} ID_SERVICO IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_HABILIDADE WHERE ID_HABILIDADE = $${values.length + 1} ) `;
    values.push(id_habilidade);
  }
  if (id_categoria) {
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} ID_SERVICO IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_CATEGORIA WHERE ID_CATEGORIA = $${values.length + 1} ) `;
    values.push(id_categoria);
  }
  if (id_usuario_prestador) {
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} ID_SERVICO IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_PRESTADOR WHERE ID_USUARIO_PRESTADOR = $${values.length + 1} ) `;
    values.push(id_usuario_prestador);
  }
  if (id_usuario_busca) {
    clause += ` ${values.length === 0 ? "WHERE" : "AND"} ID_USUARIO_SOLICITANTE != $${values.length + 1} AND ID_SERVICO NOT IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_PRESTADOR WHERE ID_USUARIO_PRESTADOR = $${values.length + 2} ) `;
    values.push(id_usuario_busca);
    values.push(id_usuario_busca);
  }
  const query = `SELECT * FROM VW_SERVICO ${clause} ORDER BY ID_SERVICO DESC`;
  result = yield client.query(query, values);
  return result.rows;
});
var findConflictServices = (filter) => __async(null, null, function* () {
  let result;
  const client = yield postgressql_default;
  let { dth_servico, dth_fim_servico, id_usuario } = filter;
  const query1 = `SELECT * FROM VW_SERVICO
                    WHERE ID_USUARIO_SOLICITANTE = $1
                    AND ID_STATUS != ${status_default2.CANCELED}
                    AND $2 < DTH_FIM_SERVICO AND DTH_SERVICO < $3`;
  const values1 = [id_usuario, dth_servico, dth_fim_servico];
  const result1 = yield client.query(query1, values1);
  const query2 = `SELECT * FROM VW_SERVICO_PRESTADOR
                    WHERE ID_USUARIO_PRESTADOR = $1
                    AND ID_STATUS != ${status_default2.CANCELED}
                    AND $2 < DTH_FIM_SERVICO AND DTH_SERVICO < $3`;
  const values2 = [id_usuario, dth_servico, dth_fim_servico];
  const result2 = yield client.query(query2, values2);
  result = result1.rows.concat(result2.rows);
  return result;
});
var findServiceSkills = (filter) => __async(null, null, function* () {
  let result;
  const client = yield postgressql_default;
  let { id_servico } = filter;
  const values = [id_servico];
  result = yield client.query(`SELECT * FROM VW_SERVICO_HABILIDADE  
                                WHERE ID_SERVICO = $1`, values);
  return result.rows;
});
var findServiceCategories = (filter) => __async(null, null, function* () {
  let result;
  const client = yield postgressql_default;
  let { id_servico } = filter;
  const values = [id_servico];
  result = yield client.query(`SELECT * FROM VW_SERVICO_CATEGORIA  
                                WHERE ID_SERVICO = $1`, values);
  return result.rows;
});
var findServiceProviderUsers = (filter) => __async(null, null, function* () {
  let result;
  const client = yield postgressql_default;
  let { id_servico } = filter;
  const values = [id_servico];
  result = yield client.query(`SELECT * FROM VW_SERVICO_PRESTADOR  
                                WHERE ID_SERVICO = $1`, values);
  return result.rows;
});
var insertService = (service) => __async(null, null, function* () {
  var _a;
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { nom_servico, desc_servico, id_usuario_solicitante, id_projeto_pai, dth_servico, dth_fim_servico, num_tempo_estimado, num_novo_saldo, num_qtd_prestadores, id_habilidade_lista, id_categoria_lista } = service;
    const insertQuery = `
            INSERT INTO TB_SERVICO (nom_servico, desc_servico, id_usuario_solicitante, id_projeto_pai, dth_servico, dth_fim_servico, num_tempo_estimado, num_qtd_prestadores, id_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ${status_default2.PENDING})
            RETURNING id_servico;
        `;
    const values = [nom_servico, desc_servico, id_usuario_solicitante, id_projeto_pai, dth_servico, dth_fim_servico, num_tempo_estimado, num_qtd_prestadores];
    const result = yield client.query(insertQuery, values);
    const id = (_a = result.rows[0]) == null ? void 0 : _a.id_servico;
    for (const id_habilidade of id_habilidade_lista) {
      yield client.query(`INSERT INTO TB_SERVICO_HABILIDADE(id_servico, id_habilidade) VALUES($1, $2)`, [id, id_habilidade]);
    }
    for (const id_categoria of id_categoria_lista) {
      yield client.query(`INSERT INTO TB_SERVICO_CATEGORIA(id_servico, id_categoria) VALUES($1, $2)`, [id, id_categoria]);
    }
    yield client.query(`UPDATE TB_USUARIO SET NUM_SALDO_HORAS = $1 WHERE ID_USUARIO = $2`, [num_novo_saldo, id_usuario_solicitante]);
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Servi\xE7o inserido com sucesso",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao criar servi\xE7o",
      error: err.message
    };
  }
});
var updateServiceProviders = (serviceProvider) => __async(null, null, function* () {
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { id_servico, id_usuario_prestador, id_novo_status } = serviceProvider;
    const updateQuery = `
            UPDATE TB_SERVICO SET ID_STATUS = $1 
            WHERE ID_SERVICO = $2;
        `;
    const valuesUpdate = [id_novo_status, id_servico];
    yield client.query(updateQuery, valuesUpdate);
    const insertQuery = `
            INSERT INTO TB_SERVICO_PRESTADOR (ID_SERVICO, ID_USUARIO_PRESTADOR)
            VALUES ($1, $2);
        `;
    const valuesInsert = [id_servico, id_usuario_prestador];
    yield client.query(insertQuery, valuesInsert);
    const id = id_servico;
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Prestador de Servi\xE7o vinculado com sucesso!",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao atualizar prestadores do servi\xE7o",
      error: err.message
    };
  }
});
var updateServiceFinalization = (serviceFinalization) => __async(null, null, function* () {
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { id_servico, id_usuario_solicitante, num_saldo_horas_reajuste, id_usuario_prestador_list, num_tempo_estimado } = serviceFinalization;
    const id_novo_status = status_default2.DONE;
    const updateServiceQuery = `
            UPDATE TB_SERVICO SET ID_STATUS = $1 
            WHERE ID_SERVICO = $2;
        `;
    const valuesUpdateService = [id_novo_status, id_servico];
    yield client.query(updateServiceQuery, valuesUpdateService);
    if (num_saldo_horas_reajuste && num_saldo_horas_reajuste > 0) {
      const updateUserQuery = `
                    UPDATE TB_USUARIO SET NUM_SALDO_HORAS = $1 
                    WHERE ID_USUARIO = $2;
                `;
      const valuesUpdateUser = [num_saldo_horas_reajuste, id_usuario_solicitante];
      yield client.query(updateUserQuery, valuesUpdateUser);
    }
    if (id_usuario_prestador_list)
      for (const id_usuario_prestador of id_usuario_prestador_list) {
        const updateUserQuery = `
                    UPDATE TB_USUARIO SET NUM_SALDO_HORAS = NUM_SALDO_HORAS + $1 
                    WHERE ID_USUARIO = $2;
                `;
        const valuesUpdateUser = [num_tempo_estimado, id_usuario_prestador];
        yield client.query(updateUserQuery, valuesUpdateUser);
      }
    const id = id_servico;
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Servi\xE7o finalizado com sucesso!",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao finalizar servi\xE7o",
      error: err.message
    };
  }
});
var updateServiceRate = (serviceRate) => __async(null, null, function* () {
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { id_servico, avaliacao_usuario_list } = serviceRate;
    for (const avaliacao_usuario of avaliacao_usuario_list) {
      const { id_usuario, num_nota_avaliacao, desc_comentario_avaliacao } = avaliacao_usuario;
      const updateRateQuery = `
                    UPDATE TB_SERVICO_PRESTADOR SET NUM_NOTA_AVALIACAO = $1,
                                                    DESC_COMENTARIO_AVALIACAO = $2 
                    WHERE ID_SERVICO = $3
                    AND ID_USUARIO_PRESTADOR = $4;
                `;
      const valuesUpdateUser = [num_nota_avaliacao, desc_comentario_avaliacao, id_servico, id_usuario];
      yield client.query(updateRateQuery, valuesUpdateUser);
    }
    const id = id_servico;
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Servi\xE7o avaliado com sucesso!",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao avaliar servi\xE7o",
      error: err.message
    };
  }
});

// src/library/utils/general.ts
var arraysNumericosIguais = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((valor, indice) => valor === arr2[indice]);
};

// src/api/services/services.ts
var getServiceService = (filter) => __async(null, null, function* () {
  let data = yield findAllServices(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getServiceSkillsService = (filter) => __async(null, null, function* () {
  let data = yield findServiceSkills(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getServiceCategoriesService = (filter) => __async(null, null, function* () {
  let data = yield findServiceCategories(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var getServiceProviderUsersService = (filter) => __async(null, null, function* () {
  let data = yield findServiceProviderUsers(filter);
  let response;
  if (data.length > 0) {
    response = yield ok(data);
  } else {
    response = yield noContent();
  }
  return response;
});
var postServiceService = (service) => __async(null, null, function* () {
  let response;
  const { dth_servico, dth_fim_servico, num_qtd_prestadores, id_usuario_solicitante } = service;
  let num_tempo_estimado = dth_fim_servico.getTime() - dth_servico.getTime();
  num_tempo_estimado = num_tempo_estimado / (1e3 * 60 * 60);
  const num_tempo_total = num_tempo_estimado * num_qtd_prestadores;
  const userData = yield findAllUsers({ id_usuario: id_usuario_solicitante });
  if (userData.length > 0) {
    const user2 = userData[0];
    if (user2.num_saldo_horas >= num_tempo_total) {
      const dateConflict = yield findConflictServices({ id_usuario: id_usuario_solicitante, dth_servico, dth_fim_servico });
      if (dateConflict.length > 0) {
        response = yield badRequest("N\xE3o \xE9 poss\xEDvel criar o servi\xE7o por conta de conflitos de hor\xE1rios!");
      } else {
        service["num_tempo_estimado"] = num_tempo_estimado;
        service["num_novo_saldo"] = user2.num_saldo_horas - num_tempo_total;
        const result = yield insertService(service);
        if (result.success) {
          response = yield created(result.id);
        } else
          response = yield badRequest(result.message);
      }
    } else {
      response = yield badRequest("Saldo de Horas do usu\xE1rio \xE9 insuficiente para solicitar servi\xE7o!");
    }
  } else {
    response = yield badRequest("Usu\xE1rio inv\xE1lido!");
  }
  return response;
});
var patchServiceProvidersService = (serviceProvider) => __async(null, null, function* () {
  let response;
  const { id_servico, id_usuario_prestador } = serviceProvider;
  const serviceRequiredSkills = yield findServiceSkills({ id_servico });
  const userSkills = yield findUserSkills({ id_usuario: id_usuario_prestador });
  const serviceSkillsIds = serviceRequiredSkills.map((elem) => elem.id_habilidade);
  const userSkillsIds = userSkills.map((elem) => elem.id_habilidade);
  const hasAllSkills = serviceSkillsIds.every((elem) => userSkillsIds.includes(elem));
  if (hasAllSkills) {
    const service = yield findAllServices({ id_servico });
    const { dth_servico, dth_fim_servico, num_qtd_prestadores, num_qtd_prestadores_confirmados } = service[0];
    const dateConflict = yield findConflictServices({ id_usuario: id_usuario_prestador, dth_servico, dth_fim_servico });
    if (dateConflict.length > 0) {
      response = yield badRequest("N\xE3o \xE9 poss\xEDvel criar o servi\xE7o por conta de conflitos de hor\xE1rios!");
    } else {
      let id_novo_status;
      if (num_qtd_prestadores == num_qtd_prestadores_confirmados) {
        response = yield badRequest("O servi\xE7o j\xE1 est\xE1 lotado!");
      } else {
        if (num_qtd_prestadores_confirmados + 1 == num_qtd_prestadores) {
          id_novo_status = status_default2.TOTAL_ACCEPTED;
        } else {
          id_novo_status = status_default2.PARCIAL_ACCEPTED;
        }
        const result = yield updateServiceProviders({ id_servico, id_usuario_prestador, id_novo_status });
        if (result.success) {
          response = yield ok(result.id);
        } else
          response = yield badRequest(result.message);
      }
    }
  } else
    response = yield badRequest("O usu\xE1rio deve ter as habilidades necess\xE1rias para prestar o servi\xE7o!");
  return response;
});
var patchServiceFinalizationService = (serviceFinalization) => __async(null, null, function* () {
  let response;
  const serviceSearch = yield findAllServices({ id_servico: serviceFinalization.id_servico });
  if (serviceSearch.length > 0) {
    const service = serviceSearch[0];
    const { id_servico, id_usuario_solicitante, num_qtd_prestadores, num_qtd_prestadores_confirmados, num_tempo_estimado } = service;
    let num_saldo_horas_reajuste = 0;
    if (num_qtd_prestadores_confirmados < num_qtd_prestadores) {
      const devolucao_horas = (num_qtd_prestadores - num_qtd_prestadores_confirmados) * num_tempo_estimado;
      const userSearch = yield findAllUsers({ id_usuario: id_usuario_solicitante });
      const user2 = userSearch[0];
      const { num_saldo_horas } = user2;
      num_saldo_horas_reajuste = num_saldo_horas + devolucao_horas;
    }
    const serviceProviders = yield findServiceProviderUsers({ id_servico });
    const id_usuario_prestador_list = serviceProviders.map((elem) => parseInt(elem.id_usuario_prestador));
    const result = yield updateServiceFinalization({ id_servico, id_usuario_solicitante, num_saldo_horas_reajuste, num_tempo_estimado, id_usuario_prestador_list });
    const usuario_prestador_info_list = serviceProviders.map((elem) => {
      return { id_usuario_prestador: elem.id_usuario_prestador, nom_usuario: elem.nom_usuario };
    });
    if (result.success) {
      response = yield ok({ message: result.message, id_servico: result.id, avaliar_usuarios: usuario_prestador_info_list });
    } else
      response = yield badRequest(result.message);
  } else {
    response = yield badRequest("Servi\xE7o inv\xE1lido!");
  }
  return response;
});
var patchServiceRateService = (serviceRate) => __async(null, null, function* () {
  let response;
  const { avaliacao_usuario_list } = serviceRate;
  const serviceProviders = yield findServiceProviderUsers({ id_servico: serviceRate.id_servico });
  const id_usuario_prestador_list = serviceProviders.map((elem) => parseInt(elem.id_usuario_prestador));
  const id_usuario_avaliado_list = avaliacao_usuario_list.map((elem) => elem.id_usuario);
  if (arraysNumericosIguais(id_usuario_prestador_list, id_usuario_avaliado_list)) {
    const result = yield updateServiceRate(serviceRate);
    if (result.success) {
      response = yield ok(result);
    } else
      response = yield badRequest(result.message);
  } else
    response = yield badRequest("Lista de usu\xE1rios prestadores informados n\xE3o \xE9 compat\xEDvel com a real");
  return response;
});

// src/api/controllers/services.ts
var getServices = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getServiceService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var getServiceSkills = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getServiceSkillsService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var getServiceCategories = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getServiceCategoriesService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var getServiceProviderUsers = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield getServiceProviderUsersService((_a = req.validated) == null ? void 0 : _a.query);
  res.status(response.statusCode).json(response.body);
});
var postService = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield postServiceService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var patchServiceProviders = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchServiceProvidersService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var patchServiceFinalization = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchServiceFinalizationService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var patchServiceRate = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchServiceRateService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});

// src/api/routes/services.ts
function services_default(router2) {
  router2.get("/service", validate(getServiceSchema, "query"), authenticateToken("default"), getServices);
  router2.get("/service/skills", validate(getSkillsByServiceSchema, "query"), authenticateToken("default"), getServiceSkills);
  router2.get("/service/categories", validate(getCategoriesByServiceSchema, "query"), authenticateToken("default"), getServiceCategories);
  router2.get("/service/providerUsers", validate(getProviderUsersByServiceSchema, "query"), authenticateToken("default"), getServiceProviderUsers);
  router2.post("/service", validate(postServiceSchema, "body"), authenticateToken("default"), postService);
  router2.patch("/service/provide", validate(patchProvideServiceSchema, "body"), authenticateToken("default"), patchServiceProviders);
  router2.patch("/service/finalize", validate(patchServiceFinalizationSchema, "body"), authenticateToken("default"), patchServiceFinalization);
  router2.patch("/service/rate", validate(patchServiceRateSchema, "body"), authenticateToken("default"), patchServiceRate);
}

// src/api/routes/routes.ts
var router = (0, import_express.Router)();
users_default(router);
categories_default(router);
skills_default(router);
cities_default(router);
states_default(router);
status_default(router);
services_default(router);
var routes_default = router;

// src/app.ts
var Server = class {
  constructor() {
    this.app = (0, import_express2.default)();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(import_express2.default.json({ limit: "500mb" }));
    this.app.use(import_express2.default.urlencoded({
      limit: "500mb",
      extended: true,
      parameterLimit: 5e5
    }));
    this.app.use((req, res, next) => {
      const origin = req.get("Origin") || "*";
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "*, access-control-allow-headers, x-authorization-method, accept-language, authentication, referer, cache-control, Access, Content-type, Authorization, Accept, Origin, X-Requested-With, x-api-key, x-ms-access-token, access-control-allow-origin"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      if (req.method === "OPTIONS") {
        return res.sendStatus(204);
      }
      next();
    });
  }
  routes() {
    this.app.use("/api/v1", routes_default);
  }
  getApp() {
    return this.app;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Server
});

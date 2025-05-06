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

// src/api/controllers/users.ts
var users_exports = {};
__export(users_exports, {
  getUserSkills: () => getUserSkills,
  getUsers: () => getUsers,
  patchUserById: () => patchUserById,
  postUser: () => postUser,
  postUserLogin: () => postUserLogin
});
module.exports = __toCommonJS(users_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserSkills,
  getUsers,
  patchUserById,
  postUser,
  postUserLogin
});

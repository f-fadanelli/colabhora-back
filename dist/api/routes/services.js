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

// src/api/routes/services.ts
var services_exports = {};
__export(services_exports, {
  default: () => services_default
});
module.exports = __toCommonJS(services_exports);

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

// src/library/schemas/services.ts
var import_zod = require("zod");
var getServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int().optional(),
  id_usuario_solicitante: import_zod.z.coerce.number().int().optional(),
  id_usuario_prestador: import_zod.z.coerce.number().int().optional(),
  id_usuario_busca: import_zod.z.coerce.number().int().optional(),
  id_projeto_pai: import_zod.z.coerce.number().int().optional(),
  id_cidade: import_zod.z.coerce.number().int().optional(),
  id_status: import_zod.z.coerce.number().int().optional(),
  dth_servico_low: import_zod.z.coerce.date().optional(),
  dth_servico_high: import_zod.z.coerce.date().optional(),
  dth_fim_servico_low: import_zod.z.coerce.date().optional(),
  dth_fim_servico_high: import_zod.z.coerce.date().optional(),
  id_habilidade: import_zod.z.coerce.number().int().optional(),
  id_categoria: import_zod.z.coerce.number().int().optional()
}).strict();
var getConflictServiceSchema = import_zod.z.object({
  id_usuario: import_zod.z.coerce.number().int(),
  dth_servico: import_zod.z.coerce.date(),
  dth_fim_servico: import_zod.z.coerce.date()
}).strict();
var getSkillsByServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int()
}).strict();
var getCategoriesByServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int()
}).strict();
var getProviderUsersByServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.coerce.number().int()
}).strict();
var postServiceSchema = import_zod.z.object({
  nom_servico: import_zod.z.string(),
  desc_servico: import_zod.z.string(),
  id_usuario_solicitante: import_zod.z.number().int(),
  id_projeto_pai: import_zod.z.number().int().optional(),
  dth_servico: import_zod.z.coerce.date(),
  dth_fim_servico: import_zod.z.coerce.date(),
  num_tempo_estimado: import_zod.z.number().int().optional(),
  num_novo_saldo: import_zod.z.number().int().optional(),
  num_qtd_prestadores: import_zod.z.number().int(),
  id_habilidade_lista: import_zod.z.array(import_zod.z.number().int()),
  id_categoria_lista: import_zod.z.array(import_zod.z.number().int())
}).strict();
var patchProvideServiceSchema = import_zod.z.object({
  id_servico: import_zod.z.number().int(),
  id_usuario_prestador: import_zod.z.number().int(),
  id_novo_status: import_zod.z.number().int().optional()
}).strict();
var patchServiceFinalizationSchema = import_zod.z.object({
  id_servico: import_zod.z.number().int(),
  id_usuario_solicitante: import_zod.z.number().int().optional(),
  num_saldo_horas_reajuste: import_zod.z.number().int().optional(),
  num_tempo_estimado: import_zod.z.number().int().optional(),
  id_usuario_prestador_list: import_zod.z.array(import_zod.z.number().int()).optional()
}).strict();
var patchServiceCancelationSchema = import_zod.z.object({
  id_servico: import_zod.z.number().int(),
  id_usuario_solicitante: import_zod.z.number().int().optional(),
  num_saldo_horas_reajuste: import_zod.z.number().int().optional()
}).strict();
var patchServiceRateSchema = import_zod.z.object({
  id_servico: import_zod.z.number().int(),
  avaliacao_usuario_list: import_zod.z.array(
    import_zod.z.object(
      {
        id_usuario: import_zod.z.number().int(),
        num_nota_avaliacao: import_zod.z.number().int(),
        desc_comentario_avaliacao: import_zod.z.string()
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
var status_default = StatusEnum;

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
                    AND ID_STATUS != ${status_default.CANCELED}
                    AND $2 < DTH_FIM_SERVICO AND DTH_SERVICO < $3`;
  const values1 = [id_usuario, dth_servico, dth_fim_servico];
  const result1 = yield client.query(query1, values1);
  const query2 = `SELECT * FROM VW_SERVICO_PRESTADOR
                    WHERE ID_USUARIO_PRESTADOR = $1
                    AND ID_STATUS != ${status_default.CANCELED}
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ${status_default.PENDING})
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
    const id_novo_status = status_default.DONE;
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
var updateServiceCancelation = (serviceFinalization) => __async(null, null, function* () {
  const client = yield postgressql_default;
  try {
    yield client.query("BEGIN");
    const { id_servico, id_usuario_solicitante, num_saldo_horas_reajuste } = serviceFinalization;
    const id_novo_status = status_default.CANCELED;
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
    const id = id_servico;
    yield client.query("COMMIT");
    return {
      success: true,
      message: "Servi\xE7o cancelado com sucesso!",
      id
    };
  } catch (err) {
    yield client.query("ROLLBACK");
    return {
      success: false,
      message: "Erro ao cancelar servi\xE7o",
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

// src/library/utils/general.ts
var arraysNumericosIguais = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((valor, indice) => valor === arr2[indice]);
};

// src/library/utils/mails.ts
var import_nodemailer = __toESM(require("nodemailer"));
var sendEmail = (receiverEmail, subject, text) => __async(null, null, function* () {
  try {
    const transport = import_nodemailer.default.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: receiverEmail,
      subject,
      text
    };
    const info = yield transport.sendMail(mailOptions);
    if (info) {
      return { success: true, message: "Success" };
    } else {
      console.log(info);
      return { success: false, message: "Fail" };
    }
  } catch (err) {
    return { success: false, message: err };
  }
});

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
        if (user2.flg_tipo_usuario == "PF") {
          service["num_novo_saldo"] = user2.num_saldo_horas - num_tempo_total;
        } else {
          service["num_novo_saldo"] = user2.num_saldo_horas;
        }
        const result = yield insertService(service);
        if (result.success) {
          const subject = `Cria\xE7\xE3o de Servi\xE7o ${result.id}: ${service.nom_servico}`;
          const text = `Ol\xE1, ${user2.nom_usuario}! Seu novo servi\xE7o foi criado com o c\xF3digo ${result.id}!`;
          const receivers = [user2.cod_email_usuario];
          const emailNotification = yield sendEmail(receivers, subject, text);
          if (emailNotification.success) {
            console.log("Enviado");
          }
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
    const providerUserSearch = yield findAllUsers({ id_usuario: id_usuario_prestador });
    const providerUser = providerUserSearch[0];
    const serviceSearch = yield findAllServices({ id_servico });
    const service = serviceSearch[0];
    const { dth_servico, dth_fim_servico, num_qtd_prestadores, num_qtd_prestadores_confirmados } = service;
    const dateConflict = yield findConflictServices({ id_usuario: id_usuario_prestador, dth_servico, dth_fim_servico });
    if (dateConflict.length > 0) {
      response = yield badRequest("N\xE3o \xE9 poss\xEDvel criar o servi\xE7o por conta de conflitos de hor\xE1rios!");
    } else {
      let id_novo_status;
      if (num_qtd_prestadores == num_qtd_prestadores_confirmados) {
        response = yield badRequest("O servi\xE7o j\xE1 est\xE1 lotado!");
      } else {
        if (num_qtd_prestadores_confirmados + 1 == num_qtd_prestadores) {
          id_novo_status = status_default.TOTAL_ACCEPTED;
        } else {
          id_novo_status = status_default.PARCIAL_ACCEPTED;
        }
        const result = yield updateServiceProviders({ id_servico, id_usuario_prestador, id_novo_status });
        if (result.success) {
          const subject = `Aceite do Servi\xE7o ${id_servico}: ${service.nom_servico}`;
          const text = `Ol\xE1! Servi\xE7o ${id_servico} aceito por ${providerUser.nom_usuario}!`;
          const receivers = [providerUser.cod_email_usuario, service.cod_email_usuario];
          const emailNotification = yield sendEmail(receivers, subject, text);
          if (emailNotification.success) {
            console.log("Enviado");
          }
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
      return { id_usuario_prestador: elem.id_usuario_prestador, nom_usuario: elem.nom_usuario_prestador };
    });
    if (result.success) {
      let receivers = serviceProviders.map((elem) => elem.cod_email_usuario_prestador);
      receivers.push(service.cod_email_usuario);
      const subject = `Finaliza\xE7\xE3o do Servi\xE7o ${id_servico}: ${service.nom_servico}`;
      const text = `Ol\xE1! Servi\xE7o ${id_servico} finalizado com sucesso!`;
      const emailNotification = yield sendEmail(receivers, subject, text);
      if (emailNotification.success) {
        console.log("Enviado");
      }
      response = yield ok({ message: result.message, id_servico: result.id, avaliar_usuarios: usuario_prestador_info_list });
    } else
      response = yield badRequest(result.message);
  } else {
    response = yield badRequest("Servi\xE7o inv\xE1lido!");
  }
  return response;
});
var patchServiceCancelationService = (serviceCancelation) => __async(null, null, function* () {
  let response;
  const serviceSearch = yield findAllServices({ id_servico: serviceCancelation.id_servico });
  if (serviceSearch.length > 0) {
    const service = serviceSearch[0];
    const { id_servico, id_usuario_solicitante, num_qtd_prestadores, num_tempo_estimado } = service;
    const devolucao_horas = num_qtd_prestadores * num_tempo_estimado;
    const userSearch = yield findAllUsers({ id_usuario: id_usuario_solicitante });
    const user2 = userSearch[0];
    const { num_saldo_horas } = user2;
    const num_saldo_horas_reajuste = num_saldo_horas + devolucao_horas;
    const serviceProviders = yield findServiceProviderUsers({ id_servico });
    const result = yield updateServiceCancelation({ id_servico, id_usuario_solicitante, num_saldo_horas_reajuste });
    if (result.success) {
      let receivers = serviceProviders.map((elem) => elem.cod_email_usuario_prestador);
      receivers.push(service.cod_email_usuario);
      const subject = `Cancelamento do Servi\xE7o ${id_servico}: ${service.nom_servico}`;
      const text = `Ol\xE1! Servi\xE7o ${id_servico} cancelado!`;
      const emailNotification = yield sendEmail(receivers, subject, text);
      if (emailNotification.success) {
        console.log("Enviado");
      }
      response = yield ok({ message: result.message, id_servico: result.id });
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
var patchServiceCancelation = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchServiceCancelationService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});
var patchServiceRate = (req, res) => __async(null, null, function* () {
  var _a;
  const response = yield patchServiceRateService((_a = req.validated) == null ? void 0 : _a.body);
  res.status(response.statusCode).json(response.body);
});

// src/api/routes/services.ts
function services_default(router) {
  router.get("/service", validate(getServiceSchema, "query"), authenticateToken("default"), getServices);
  router.get("/service/skills", validate(getSkillsByServiceSchema, "query"), authenticateToken("default"), getServiceSkills);
  router.get("/service/categories", validate(getCategoriesByServiceSchema, "query"), authenticateToken("default"), getServiceCategories);
  router.get("/service/providerUsers", validate(getProviderUsersByServiceSchema, "query"), authenticateToken("default"), getServiceProviderUsers);
  router.post("/service", validate(postServiceSchema, "body"), authenticateToken("default"), postService);
  router.patch("/service/provide", validate(patchProvideServiceSchema, "body"), authenticateToken("default"), patchServiceProviders);
  router.patch("/service/finalize", validate(patchServiceFinalizationSchema, "body"), authenticateToken("default"), patchServiceFinalization);
  router.patch("/service/cancel", validate(patchServiceCancelationSchema, "body"), authenticateToken("default"), patchServiceCancelation);
  router.patch("/service/rate", validate(patchServiceRateSchema, "body"), authenticateToken("default"), patchServiceRate);
}

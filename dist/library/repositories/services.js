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

// src/library/repositories/services.ts
var services_exports = {};
__export(services_exports, {
  findAllServices: () => findAllServices,
  findConflictServices: () => findConflictServices,
  findServiceCategories: () => findServiceCategories,
  findServiceProviderUsers: () => findServiceProviderUsers,
  findServiceSkills: () => findServiceSkills,
  insertService: () => insertService,
  updateServiceProviders: () => updateServiceProviders
});
module.exports = __toCommonJS(services_exports);

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

// src/library/enums/status.ts
var StatusEnum = Object.freeze({
  PENDING: 5,
  PARCIAL_ACCEPTED: 6,
  TOTAL_ACCEPTED: 7,
  DONE: 8,
  CANCELED: 9
});
var status_default = StatusEnum;

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findAllServices,
  findConflictServices,
  findServiceCategories,
  findServiceProviderUsers,
  findServiceSkills,
  insertService,
  updateServiceProviders
});

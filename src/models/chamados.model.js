const pool = require("../config/database")
const DataBaseModel = require("../database/baseModel")
const { QueryBuilder } = require("../database/queryBuild")
const AppError = require("../errors/appError")

class ChamadosModel extends DataBaseModel {
    static table = "chamados"
    static insertAllowedFields = [
        "titulo",
        "descricao",
        "solicitante_id",
        "categoria_id",
        "prioridade",
    ]

    static updateAllowedFields = [
        "tecnico_id",
        "categoria_id",
        "prioridade",
        "status",
        "solucao"
    ]

    static selectableAllowedFields = ["*"]

    static #buildJoin(query) {
        if (!(query instanceof QueryBuilder))
            throw new TypeError("'query' deve ser uma instância de QueryBuilder")
        return query.
            join(
                "solicitantes",
                [["solicitante_id", "id"]],
                ["nome", "solicitante_nome"], "setor"
            )
            .join(
                "categorias",
                [["categoria_id", "id"]],
                ["nome", "categoria_nome"]
            )
            .leftJoin(
                "tecnicos",
                [["tecnico_id", "id"]],
                ["nome", "tecnico_nome"]
            )
    }

    static async find(key, ...fields) {
        const query = fields.length > 0
            ? this.select(...this.validateSelectFields(fields))
            : this.query()

        return this.#buildJoin(query)
            .where(this.primaryKey, key)
            .getFirst()
    }

    static async countByStatus() {
        return this.select("status")
            .count("*", "total")
            .groupBy("status")
            .get()
    }

    static async findByFilters({ status, prioridade } = {}) {
        const query = this.#buildJoin(this.query())

        if (status !== undefined)
            query.where("status", status)

        if (prioridade !== undefined)
            query.where("prioridade", prioridade)

        return query.get()
    }

}

module.exports = ChamadosModel

const pool = require("../config/database")
const DataBaseModel = require("../database/baseModel")

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

    static async all(...fields) {
        const query = fields.length > 0
            ? this.select(...this.validateSelectFields(fields))
            : this.query()

        return query
            .join(
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
            .get()
    }

    static async find(key, ...fields) {
        const query = fields.length > 0
            ? this.select(...this.validateSelectFields(fields))
            : this.query()

        return query
            .join(
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
            .where(this.primaryKey, key)
            .getFirst()
    }

}

module.exports = ChamadosModel

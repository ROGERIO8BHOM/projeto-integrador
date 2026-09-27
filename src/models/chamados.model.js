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
        "status",
    ]
    static updateAllowedFields = [
        "titulo",
        "descricao",
        "solicitante_id",
        "tecnico_id",
        "categoria_id",
        "prioridade",
        "status",
        "solucao"
    ]
    static selectableAllowedFields = ["*"]
}
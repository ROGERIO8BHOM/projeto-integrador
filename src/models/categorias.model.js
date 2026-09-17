const pool = require("../config/database")
const DataBaseModel = require("../database/baseModel")

class CategoriasModel extends DataBaseModel {
    static table = "categorias"
    static insertAllowedFields = ["nome", "descricao"]
    static updateAllowedFields = ["nome", "descricao"]
    static selectableAllowedFields = ["*"]
}

module.exports = CategoriasModel
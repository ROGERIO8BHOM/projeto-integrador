const pool = require("../config/database")
const DataBaseModel = require("../database/baseModel")

class SolicitantesModel extends DataBaseModel {
    static table = "solicitantes"
    static insertAllowedFields = ["nome", "email", "setor"]
    static updateAllowedFields = ["nome", "email", "setor"]
    static selectableAllowedFields = ["*"]

    static async findByEmail(email) {
        const response = await this.where("email", email).getFirst()
        return response
    }
}

module.exports = SolicitantesModel
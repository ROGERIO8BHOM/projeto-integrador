const pool = require("../config/database")
const DataBaseModel = require("../database/baseModel")

class TecnicosModel extends DataBaseModel {
    static table = "tecnicos"
    static insertAllowedFields = ["nome", "email"]
    static updateAllowedFields = ["nome", "email"]
    static selectableAllowedFields = ["*"]
    
    static async findByEmail(email) {
        const response = await this.where("email", email).getFirst()
        return response
    }
}

module.exports = TecnicosModel

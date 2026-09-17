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

    // static async getAll() {
    //     const [response] = await pool.execute(
    //         "SELECT id, nome, email FROM tecnicos"
    //     )
    //     return response
    // }

    // static async findById(id) {
    //     const [response] = await pool.execute(
    //         "SELECT id, nome, email FROM tecnicos WHERE id = ?",
    //         [id]
    //     )
    //     return response[0]
    // }

    // static async findByEmail(email) {
    //     const [rows] = await pool.execute(
    //         `SELECT id, nome, email FROM tecnicos
    //         WHERE email = ?`,
    //         [email]
    //     )

    //     return rows[0]
    // }

    // static async add({ nome, email }) {
    //     const [response] = await pool.execute(
    //         `INSERT INTO tecnicos (nome, email) 
    //         VALUES (?, ?)`,
    //         [nome, email]
    //     )
    //     return response.insertId
    // }

    // static async update(id, { nome, email }) {
    //     const [response] = await pool.execute(
    //         `UPDATE tecnicos SET nome = ?, email = ? 
    //         WHERE id = ?`,
    //         [nome, email, id]
    //     )
    //     return response.affectedRows
    // }

    // static async delete(id) {
    //     const [response] = await pool.execute(
    //         "DELETE FROM tecnicos WHERE id = ?",
    //         [id]
    //     )
    //     return response.affectedRows
    // }

}

module.exports = TecnicosModel

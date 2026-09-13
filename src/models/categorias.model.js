const pool = require("../config/database")

class CategoriasModel {
    static async getAll() {
        const [rows] = await pool.execute("SELECT id, nome, descricao FROM categorias") 
        return rows
    }

    static async findById(id) {
        const [rows] = await pool.execute("SELECT id, nome, descricao FROM categorias WHERE id = ?", [id])
        return rows[0]
    }

    static async add ({nome, descricao} ) {
        const [result] = await pool.execute(
            "INSERT INTO categorias (nome, descricao) VALUES (?, ?)",
            [nome, descricao]
        )
        return result.insertId
    }

    static async update(id, {nome, descricao}) {
        const [result] = await pool.execute(
            "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?", 
            [nome, descricao, id]
        )
        return result.affectedRows
    }

    static async delete (id) {
        const [result] = await pool.execute(
            "DELETE FROM categorias WHERE id = ?",
            [id]
        )
        return result.affectedRows
    }

}

module.exports = CategoriasModel

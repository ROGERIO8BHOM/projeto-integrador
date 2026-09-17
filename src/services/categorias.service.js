const CategoriasModel = require("../models/categorias.model")
const AppError = require('../errors/appError')

class CategoriasService {
    static #parseCategoria({ nome, descricao } = {}) {
        const _nome = typeof nome === "string"
            ? nome.trim()
            : ""

        if (!_nome)
            throw new AppError('Nome necessário')

        const _descricao = typeof descricao === "string"
            ? descricao ? descricao.trim()
            : "Não possui descrição" : "Não possui descrição"

        return { nome: _nome, descricao: _descricao }
    }

    static async getAll() {
        return CategoriasModel.all()
    }

    static async findById(id) {
        const categoria = await CategoriasModel.find(id)

        if (!categoria)
            throw new AppError("Categoria não encontrada", 404)

        return categoria
    }

    static async add(dadosCategoria) {
        const _dadosCategoria = CategoriasService.#parseCategoria(dadosCategoria)

        return CategoriasModel.add(_dadosCategoria)
    }

    static async update(id, dadosCategoria) {
        const _dadosCategoria = CategoriasService.#parseCategoria(dadosCategoria)

        const updatedRows = await CategoriasModel.update(id, _dadosCategoria)
        if (updatedRows === 0)
            throw new AppError("Categoria não encontrada", 404)

        return updatedRows
    }

    static async delete(id) {
        const deletedRows = await CategoriasModel.delete(id)
        
        if (deletedRows === 0)
            throw new AppError("Categoria não encontrada", 404)

        return deletedRows
    }
}

module.exports = CategoriasService
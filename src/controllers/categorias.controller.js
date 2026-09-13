const CategoriasService = require("../services/categorias.service")
const { parseID } = require("../utils/validators")
const AppError = require("../errors/appError")

class CategoriasController {
    static async getAll(req, res) {
        const categorias = await CategoriasService.getAll()
        res.json(categorias)
    }

    static async add(req, res) {
        const dados = req.body
        const id = await CategoriasService.add(dados)
        res.json({ message: `Categoria adicionada com sucesso - ID: ${id}` })
    }

    static async update(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        const dados = req.body
        await CategoriasService.update(id, dados)
        res.json({ message: "Categoria atualizada com sucesso" })
    }

    static async delete(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        await CategoriasService.delete(id)
        res.json({ message: "Categoria deletada com sucesso" })
    }
}

module.exports = CategoriasController
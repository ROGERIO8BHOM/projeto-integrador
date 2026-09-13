const TecnicosService = require("../services/tecnicos.service")
const { parseID } = require("../utils/validators")
const AppError = require("../errors/appError")

class TecnicosController {
    static async getAll(req, res) {
        const tecnicos = await TecnicosService.getAll()
        res.json(tecnicos)
    }

    static async add(req, res) {
        const dados = req.body
        const id = await TecnicosService.add(dados)
        res.json({ message: `Tecnico adicionado com sucesso - ID: ${id}` })
    }

    static async update(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        const dados = req.body
        await TecnicosService.update(id, dados)
        res.json({ message: "Tecnico atualizado com sucesso" })
    }

    static async delete(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        await TecnicosService.delete(id)
        res.json({ message: "Tecnico deletado com sucesso" })
    }
}

module.exports = TecnicosController
const ChamadosService = require("../services/chamados.service")
const { parseID } = require("../utils/validators")
const AppError = require("../errors/appError")

class ChamadosController {
    static async getAll(req, res) {
        const chamados = await ChamadosService.getAll()
        res.json(chamados)
    }

    static async getById(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)
        const chamado = await ChamadosService.find(id)
        res.json(chamado)
    }

    static async add(req, res) {
        const dados = req.body
        const id = await ChamadosService.add(dados)
        res.status(201).json({ message: `Chamado adicionado com sucesso - ID: ${id}` })
    }

    static async update(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        const dados = req.body
        await ChamadosService.update(id, dados)
        res.json({ message: "Chamado atualizado com sucesso" })
    }

    static async delete(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        await ChamadosService.delete(id)
        res.json({ message: "Chamado deletado com sucesso" })
    }
}

module.exports = ChamadosController

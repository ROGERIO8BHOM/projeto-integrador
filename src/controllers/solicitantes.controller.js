const SolicitantesService = require("../services/solicitantes.service")
const { parseID } = require("../utils/validators")
const AppError = require("../errors/appError")

class SolcitantesController {
    static async get(req, res) {
        const { email } = req.query

        const resposta = email
            ? await SolicitantesService.findByEmail(email)
            : await SolicitantesService.all()

        res.json(resposta)
    }

    static async getById(req, res) {
        const id = parseID(req.params.id)
        
        if (!id)
            throw new AppError("ID inválido", 400)
        
        const resposta = await SolicitantesService.find(id)

        res.json(resposta)
    }

    static async add(req, res) {
        const dados = req.body
        const id = await SolicitantesService.add(dados)
        res.status(201).json({ message: `Solicitante adicionado com sucesso - ID: ${id}` })
    }

    static async update(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        const dados = req.body
        await SolicitantesService.update(id, dados)
        res.json({ message: "Solicitante atualizado com sucesso" })
    }

    static async delete(req, res) {
        const id = parseID(req.params.id)
        if (!id)
            throw new AppError("ID inválido", 400)

        await SolicitantesService.delete(id)
        res.json({ message: "Solicitante deletado com sucesso" })
    }
}

module.exports = SolcitantesController
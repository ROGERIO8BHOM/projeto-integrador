const SolicitantesModel = require("../models/solicitantes.model")
const { isValidEmail } = require("../utils/validators")
const AppError = require("../errors/appError")

class SolicitanteService {
    static #parseSolicitante({ nome, email, setor } = {}) {
        const _nome = typeof nome === "string"
            ? nome.trim()
            : ""

        if (!_nome)
            throw new AppError('Nome necessário', 400)

        const _email = typeof email === "string"
            ? email.trim().toLowerCase()
            : ""

        if (!isValidEmail(_email))
            throw new AppError("Email Inválido", 400)

        const _setor = typeof setor === "string" ? setor.trim() : ""
        
        if (!_setor)
            throw new AppError("Setor inválido", 400)
        
        return { nome: _nome, email: _email, setor: _setor}
    }

    static async all() {
        return await SolicitantesModel.all()
    }
    
    static async find(id) {
        const solicitante = await SolicitantesModel.find(id)
        if (!solicitante)
            throw new AppError("Não foi possível encontrar o(a) solicitante", 404)

        return solicitante
    }

    static async findByEmail(email) {
        if (!isValidEmail(email))
            throw new AppError("Email inválido", 400)

        const solicitante = await SolicitantesModel.findByEmail(email)
        if (!solicitante)
            throw new AppError("Solicitante não encontrado", 404)

        return solicitante
    }

    static async add(dadosSolicitante) {
        const _dadosSolicitante = SolicitanteService.#parseSolicitante(dadosSolicitante)
        
        if (await SolicitantesModel.findByEmail(_dadosSolicitante.email))
            throw new AppError("Email duplicado", 409)
        
        return await SolicitantesModel.add(_dadosSolicitante)
    }

    static async update(id, dadosSolicitante) {
        const _dadosSolicitante = SolicitanteService.#parseSolicitante(dadosSolicitante)

        const solcitanteDoEmail = await SolicitantesModel.findByEmail(
            _dadosSolicitante.email
        )

        if (solcitanteDoEmail && Number(solcitanteDoEmail.id) !== id)
            throw new AppError("Email duplicado", 409)

        const updatedRows = await SolicitantesModel.update(id, _dadosSolicitante)
        if (updatedRows === 0)
            throw new AppError("Solcitante não encontrado", 404)

        return updatedRows
    }

    static async delete(id) {
        const deletedRows = await SolicitantesModel.delete(id)

        if (deletedRows === 0)
            throw new AppError("Solcitante não encontrado", 404)

        return deletedRows
    }


}

module.exports = SolicitanteService
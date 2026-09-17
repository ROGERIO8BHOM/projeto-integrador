const TecnicosModel = require("../models/tecnicos.model")
const { isValidEmail } = require("../utils/validators")
const AppError = require("../errors/appError")

class TecnicosService {
    static #parseTecnico({ nome, email } = {}) {
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
        
        return { nome: _nome, email: _email }
    }

    static async getAll() {
        return TecnicosModel.all()
    }

    static async findById(id) {
        const tecnico = await TecnicosModel.find(id)

        if (!tecnico)
            throw new AppError("Não foi possível encontrar o tecnico pelo ID", 404)

        return tecnico
    }

    static async findByEmail(email) {
        if (!isValidEmail(email))
            throw new AppError("Email inválido", 400)
        
        const tecnico = await TecnicosModel.findByEmail(email)
        
        if (!tecnico)
            throw new AppError("Não foi possível encontrar o tecnico especificado", 404)

        return tecnico
    }

    static async add(dadosTecnico) {
        const _dadosTecnico = TecnicosService.#parseTecnico(dadosTecnico)
        
        if (await TecnicosModel.findByEmail(_dadosTecnico.email))
            throw new AppError("Email duplicado", 409)
        
        return TecnicosModel.add(_dadosTecnico)
    }

    static async update(id, dadosTecnico) {
        const _dadosTecnico = TecnicosService.#parseTecnico(dadosTecnico)

        const tecnicoDoEmail = await TecnicosModel.findByEmail(
            _dadosTecnico.email
        )

        if (tecnicoDoEmail && Number(tecnicoDoEmail.id) !== id)
            throw new AppError("Email duplicado", 409)

        const updatedRows = await TecnicosModel.update(id, _dadosTecnico)
        if (updatedRows === 0)
            throw new AppError("Tecnico não encontrado", 404)

        return updatedRows
    }

    static async delete(id) {
        const deletedRows = await TecnicosModel.delete(id)

        if (deletedRows === 0)
            throw new AppError("Tecnico não encontrado", 404)

        return deletedRows
    }
}

module.exports = TecnicosService
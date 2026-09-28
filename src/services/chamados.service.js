const CategoriaService = require("./categorias.service")
const SolicitanteService = require("./solicitantes.service")
const TecnicoService = require("./tecnicos.service")
const ChamadosModel = require("../models/chamados.model")
const AppError = require('../errors/appError')
const { parseID } = require("../utils/validators")

class ChamadosService {
    static #parseChamado(dados = {}, partial = false) {
        if (!dados || typeof dados !== "object" || Array.isArray(dados))
            throw new AppError("Dados inválidos")

        if ((!partial || dados.prioridade !== undefined) &&
            !["BAIXA", "MEDIA", "ALTA"].includes(dados.prioridade))
            throw new AppError("Prioridade deve ser BAIXA, MEDIA ou ALTA")

        if (dados.status !== undefined &&
            !["ABERTO", "EM_ATENDIMENTO", "CONCLUIDO"].includes(dados.status))
            throw new AppError("Status deve ser ABERTO, EM_ATENDIMENTO ou CONCLUIDO")

        if (partial)
            return dados

        dados.titulo = typeof dados.titulo === "string"
            ? dados.titulo.trim()
            : ""

        if (!dados.titulo)
            throw new AppError("Título necessário")

        dados.descricao = typeof dados.descricao === "string"
            ? dados.descricao.trim()
            : ""
        if (!dados.descricao)
            throw new AppError("Descrição Necessária")

        return dados
    }

    static async getAll() {
        return ChamadosModel.all()
    }

    static async find(id) {
        const chamado = await ChamadosModel.find(id)

        if (!chamado)
            throw new AppError("Chamado não encontrado", 404)

        return chamado
    }

    static async add(dadosChamado) {
        const _dadosChamado = ChamadosService.#parseChamado(dadosChamado)
        if (!_dadosChamado.solicitante_id || !parseID(_dadosChamado.solicitante_id))
            throw new AppError("Solicitante é obrigatório ou está inválido", 400)

        if (!_dadosChamado.categoria_id || !parseID(_dadosChamado.categoria_id))
            throw new AppError("Categoria é obrigatória ou está inválida", 400)

        await SolicitanteService.find(_dadosChamado.solicitante_id)
        await CategoriaService.findById(_dadosChamado.categoria_id)

        return ChamadosModel.add(_dadosChamado)
    }

    static async update(id, dadosChamado) {

        const _dadosChamado = ChamadosService.#parseChamado(dadosChamado, true)
        const chamado = await ChamadosService.find(id)

        if (!chamado)
            throw new AppError("Chamado não encontrado", 404)
        
        if (_dadosChamado.solucao !== undefined && _dadosChamado.solucao !== null) {
            if (typeof _dadosChamado.solucao !== "string")
                throw new AppError("A solução deve ser um texto", 400)

            _dadosChamado.solucao = _dadosChamado.solucao.trim()
        }

        if (_dadosChamado.tecnico_id !== undefined && _dadosChamado.tecnico_id !== null) {
            if (!parseID(_dadosChamado.tecnico_id))
                throw new AppError("ID do técnico inválido", 400)

            await TecnicoService.findById(_dadosChamado.tecnico_id)
        }

        if (_dadosChamado.categoria_id !== undefined) {
            if (!parseID(_dadosChamado.categoria_id))
                throw new AppError("ID da categoria inválido", 400)

            await CategoriaService.findById(_dadosChamado.categoria_id)
        }

        const statusFinal = _dadosChamado.status !== undefined
            ? _dadosChamado.status
            : chamado.status

        const tecnicoFinal = _dadosChamado.tecnico_id !== undefined
            ? _dadosChamado.tecnico_id
            : chamado.tecnico_id

        const solucaoFinal = _dadosChamado.solucao !== undefined
            ? _dadosChamado.solucao
            : chamado.solucao

        if (statusFinal === "EM_ATENDIMENTO" && !tecnicoFinal)
            throw new AppError("É necessário atribuir um técnico para iniciar o atendimento", 400)

        if (statusFinal === "CONCLUIDO" && (typeof solucaoFinal !== "string" || !solucaoFinal.trim()))
            throw new AppError("É necessário informar uma solução para concluir o chamado", 400)

        const updatedRows = await ChamadosModel.update(id, _dadosChamado)
        if (updatedRows === 0)
            throw new AppError("Chamado não encontrado", 404)

        return updatedRows
    }

    static async delete(id) {
        const deletedRows = await ChamadosModel.delete(id)

        if (deletedRows === 0)
            throw new AppError("Chamado não encontrado", 404)

        return deletedRows
    }
}

module.exports = ChamadosService

function errorHandler(err, req, res, next) {
    console.error('[ERRO]:', err.stack)

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({
            error: "Não é possível excluir ou alterar este registro porque existem registros vinculados a ele",
            status: 409
        })
    }

    const statusCode = err.statusCode || 500

    const message =
        err.isOperational
            ? err.message
            : 'Erro interno no servidor'

    return res.status(statusCode).json({
        error: message,
        status: statusCode
    })
}
module.exports = errorHandler
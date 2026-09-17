function errorHandler(err, req, res, next) {
    console.error('[ERRO]:', err.stack)
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
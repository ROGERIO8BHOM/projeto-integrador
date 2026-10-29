const RelatoriosService = require("../services/relatorios.service")

class RelatoriosController {
    static async getChamadosPorStatus(req, res) {
        const resultado = await RelatoriosService.chamadosPorStatus()
        res.json(resultado)
    }
}

module.exports = RelatoriosController


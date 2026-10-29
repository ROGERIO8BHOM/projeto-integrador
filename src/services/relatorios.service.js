const ChamadosModel = require("../models/chamados.model")

class RelatoriosService {
    static async chamadosPorStatus() {
        return ChamadosModel.countByStatus()
    }
}

module.exports = RelatoriosService

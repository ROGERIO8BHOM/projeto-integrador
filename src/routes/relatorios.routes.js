const router = require("express").Router()
const RelatoriosController = require("../controllers/relatorios.controller")

router.get("/chamados-por-status", RelatoriosController.getChamadosPorStatus)

module.exports = router


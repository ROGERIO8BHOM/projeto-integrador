const router = require("express").Router()
const ChamadosController = require("../controllers/chamados.controller")

router.get("/", ChamadosController.getAll)
router.get("/:id", ChamadosController.getById)
router.post("/", ChamadosController.add)
router.put("/:id", ChamadosController.update)
router.delete("/:id", ChamadosController.delete)

module.exports = router
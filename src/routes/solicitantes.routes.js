const router = require("express").Router()
const SolicitantesController = require("../controllers/solicitantes.controller")

router.get("/", SolicitantesController.get)
router.get("/:id", SolicitantesController.getById)
router.post("/", SolicitantesController.add)
router.put("/:id", SolicitantesController.update)
router.delete("/:id", SolicitantesController.delete)

module.exports = router
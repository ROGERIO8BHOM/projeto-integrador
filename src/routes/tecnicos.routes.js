const router = require("express").Router()
const TecnicosController = require("../controllers/tecnicos.controller")


router.get("/", TecnicosController.getAll)
router.post("/", TecnicosController.add)
router.put("/:id", TecnicosController.update)
router.delete("/:id", TecnicosController.delete)

module.exports = router
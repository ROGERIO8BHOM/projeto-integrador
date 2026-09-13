const router = require("express").Router()
const CategoriasController = require("../controllers/categorias.controller")


router.get("/", CategoriasController.getAll)
router.post("/", CategoriasController.add)
router.put("/:id", CategoriasController.update)
router.delete("/:id", CategoriasController.delete)

module.exports = router
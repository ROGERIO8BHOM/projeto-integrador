const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require("./middlewares/errorHandler")

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json()) 


// Rotas
const categoriasRoutes = require("./routes/categorias.routes")
const tecnicosRoutes = require("./routes/tecnicos.routes")
app.use("/categorias", categoriasRoutes)
app.use("/tecnicos", tecnicosRoutes)

//Error Handler
app.use(errorHandler)

module.exports = app


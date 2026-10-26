const { PRIORIDADES, STATUS } = require("../constants/chamado.constants")

const prioridadesValidas = Object.values(PRIORIDADES)
const statusValidos = Object.values(STATUS)

const parseID = (id) => {
  if (typeof id !== "string" && typeof id !== "number")
    return null

  if (typeof id === "string" && !/^\d+$/.test(id.trim()))
    return null

  const parsed = Number(id)

  if (!Number.isSafeInteger(parsed) || parsed < 1)
    return null

  return parsed
}

const isValidEmail = (email) => {
  if (typeof email !== "string")
    return false

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const normalizedEmail = email.trim().toLowerCase()

  return regex.test(normalizedEmail)
}

const isValidPrioridade = (prioridade) => prioridadesValidas.includes(prioridade)

const isValidStatus = (status) => statusValidos.includes(status)

const sanitizeIdentifier = (id) => {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id))
    throw new Error(`Identificador inválido: ${id}`);

  return `\`${id}\``;
}

module.exports = {
  parseID,
  isValidEmail,
  isValidPrioridade,
  isValidStatus,
  sanitizeIdentifier
} 
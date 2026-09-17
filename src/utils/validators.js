const parseID = (id) => {
  const _id = Number(id)
  if (!Number.isInteger(_id) || _id < 1)
    return null
  return _id
}

const isValidEmail = (email) => {
  if (!email)
    return false

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const normalizedEmail = email.trim().toLowerCase()

  return regex.test(normalizedEmail)
}

const sanitizeIdentifier = (id) => {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id))
    throw new Error(`Identificador inválido: ${id}`);

  return `\`${id}\``;
}

module.exports = {
  parseID,
  isValidEmail,
  sanitizeIdentifier
}
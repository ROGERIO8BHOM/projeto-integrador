function parseID(id) {
    const _id = Number(id)
    if (!Number.isInteger(_id) || _id < 1)
        return null
    return _id
}

function isValidEmail(email) {
  if (!email)
    return false
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const normalizedEmail = email.trim().toLowerCase()

  return regex.test(normalizedEmail)
}

module.exports = {
    parseID, 
    isValidEmail
}
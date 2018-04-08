const uuid = require('uuid/v4')
const errors = require('http-errors')

function generateUuid(amount = 1) {
  const arr = []

  for (let i = 0; i < amount; i += 1) {
    arr.push(uuid())
  }

  return arr
}

function handleAppErrors(error, req, res, next) {
  res.status(error.statusCode).json({
    error: true,
    type: error.name,
    message: error.message
  })
}

module.exports = {
  generateUuid,
  errors,
  handleAppErrors
}

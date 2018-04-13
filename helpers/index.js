const uuid = require('uuid/v4')
const errors = require('http-errors')

async function generateUuid(amount = 1) {
  const arr = []

  for (let i = 0; i < amount; i += 1) {
    arr.push(uuid())
  }

  return Promise.resolve(arr)
}

function handleErrors(error, req, res, next) {
  res.status(error.statusCode).json({
    error: true,
    type: error.name,
    message: error.message
  })

  next()
}

function requestMiddleware(req, res, next) {
  const startAt = process.hrtime()
  req.startAt = startAt
  req.requestId = uuid()

  next()
}

function responseTime(startAt) {
  const diff = process.hrtime(startAt)
  const time = (diff[0] * 1e3) + (diff[1] * 1e-6)

  return time
}

async function delay(milliseconds = 400) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function retry(fn, maxRetries, retryDelay) {
  const recursor = async (retryCount) => {
    try {
      return await fn()
    } catch (err) {
      if (retryCount === maxRetries) {
        throw new errors.RequestTimeout(`request retries (${retryCount}) exceed maximum allowed`)
      }

      await delay(retryDelay)
      return recursor(retryCount + 1)
    }
  }

  return recursor(0)
}

module.exports = {
  generateUuid,
  requestMiddleware,
  retry,
  responseTime,
  errors,
  handleErrors
}

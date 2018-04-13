const {
  generateUuid,
  retry,
  responseTime,
  errors,
  handleErrors
} = require('../helpers')
const logger = require('../lib/logger')
const repository = require('./repository')

function isAmountValid(amount) {
  if (amount < 0) {
    throw new errors.BadRequest('amount must not be a negative number')
  }

  if (amount > 1000) {
    throw new errors.BadRequest('amount must be equal to or less than 1000')
  }

  if (Number.isNaN(amount)) {
    throw new errors.BadRequest('amount must be a valid number')
  }
}

async function guidToInsert(req, amount) {
  const { requestId, ip, url, startAt, headers } = req
  const guid = {
    requestId,
    ip,
    url,
    responseTime: responseTime(startAt),
    numberOfGuids: amount,
    userAgent: headers['user-agent']
  }

  return repository.insertOne(guid)
}

async function getGuids(req, res, next) {
  const { query } = req
  const amount = Math.floor(Number(query.amount))

  try {
    isAmountValid(amount)
    logger.info(`${amount} guid${amount !== 1 ? 's' : ''} requested`)

    const result = await retry(() => generateUuid(amount), 2)

    res.json(result)

    try {
      await guidToInsert(req, amount)
    } catch (err) {
      logger.error(err.toString())
    }
  } catch (err) {
    logger.error(err.toString())
    handleErrors(err, req, res, next)
  }
}

module.exports = {
  getGuids
}

const {
  generateUuid,
  retry,
  responseTime,
  handleErrors,
  isAmountValid
} = require('../helpers')
const logger = require('../lib/logger')
const repository = require('./repository')

function guidModel(req, amount) {
  const { requestId, ip, url, startAt, headers } = req
  return {
    requestId,
    ip,
    url,
    responseTime: responseTime(startAt),
    numberOfGuids: amount,
    userAgent: headers['user-agent']
  }
}

async function getGuids(req, res, next) {
  const { query } = req

  try {
    const amount = isAmountValid(query.amount)
    logger.info(`${amount} guid${amount !== 1 ? 's' : ''} requested`)

    const response = await retry(() => generateUuid(amount), 2)

    res.json(response)

    try {
      const guid = guidModel(req, amount)
      await repository.insertOne(guid)
    } catch (err) {
      logger.error(err.toString())
    }
  } catch (err) {
    logger.error(err.toString())
    handleErrors(err, req, res, next)
  }
}

async function getTotalGuidsCount(req, res, next) {
  try {
    const response = await retry(() => repository.getTotalGuidCount(), 2)
    res.json(response)
  } catch (err) {
    logger.error(err.toString())
    handleErrors(err, req, res, next)
  }
}

module.exports = {
  getGuids,
  getTotalGuidsCount
}

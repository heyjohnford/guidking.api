const { Router } = require('express')
const { generateUuid, errors } = require('../helpers')
const Logger = require('../lib/logger')

const router = Router()
const logger = new Logger()

function getGuids({ query }, res) {
  const amount = Math.floor(Number(query.amount))

  if (amount < 0) {
    throw new errors.BadRequest('amount must not be a negative number')
  }

  if (isNaN(amount)) {
    throw new errors.BadRequest('amount must be a valid number')
  }

  res.json(generateUuid(amount))
  logger.info(`${amount} guid${amount !== 1 ? 's' : ''} requested`)
}

router.get('/', getGuids)

module.exports = router

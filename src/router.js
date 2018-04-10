const { Router } = require('express')
const { generateUuid, responseTime, errors, handleErrors } = require('../helpers')
const logger = require('../lib/logger')
const Repository = require('./repository')

const router = Router()
const repository = new Repository()

function checksAndBalances(amount) {
  if (amount < 0) {
    throw new errors.BadRequest('amount must not be a negative number')
  }

  if (amount > 1000) {
    throw new errors.BadRequest('amount must be equal to or less than 1000')
  }

  if (isNaN(amount)) {
    throw new errors.BadRequest('amount must be a valid number')
  }
}

async function getGuids(req, res, next) {
  const { query } = req
  const amount = Math.floor(Number(query.amount))

  try {
    checksAndBalances(amount)
    logger.info(`${amount} guid${amount !== 1 ? 's' : ''} requested`)

    res.json(await generateUuid(amount))
    repository.createGuid(req, amount, responseTime(req.startAt))
  } catch (err) {
    logger.error(err.toString())
    handleErrors(err, req, res, next)
  }
}

router.get('/', getGuids)

module.exports = router

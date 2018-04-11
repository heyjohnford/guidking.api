const { Router } = require('express')
const { getGuids } = require('./contoller')

const router = Router()

router.get('/', getGuids)

module.exports = router

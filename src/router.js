const { Router } = require('express')
const { getGuids, getTotalGuidsCount } = require('./controller')

const router = Router()

router.get('/', getGuids)
router.get('/total', getTotalGuidsCount)
router.get('/healthcheck', (req, res) => res.status(200).json({ ok: true }))
router.get('/readiness', (req, res) => res.status(200).json({ ok: true }))

module.exports = router

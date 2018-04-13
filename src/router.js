const { Router } = require('express')
const { getGuids } = require('./contoller')

const router = Router()

router.get('/', getGuids)
router.get('/_healthcheck', (req, res) => res.json({ ok: true }))

module.exports = router

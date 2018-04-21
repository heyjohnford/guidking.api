const { Router } = require('express')
const { getGuids } = require('./contoller')

const router = Router()

router.get('/', getGuids)
router.get('/_healthcheck', (req, res) => res.status(200).json({ ok: true }))

module.exports = router

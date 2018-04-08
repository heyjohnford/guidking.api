const express = require('express')
const { config, Logger } = require('../lib')
const { handleAppErrors } = require('../helpers')
const router = require('./router')

const app = express()
const logger = new Logger()
const PORT = config.get('env:port')

app.use(logger.setup())
app.use(logger.setup('file'))

app.use('/', router)

app.use(handleAppErrors)

app.listen(PORT, () => {
  logger.log(`✨ ${config.get('appName')} listening on port ${PORT}`)
})

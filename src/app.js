const express = require('express')
const { config, logger } = require('../lib')
const { requestMiddleware, handleErrors } = require('../helpers')
const router = require('./router')

const app = express()
const PORT = config.get('env:port')

app.use(requestMiddleware)
app.use(logger.logToStdout)
app.use(logger.logToFile)

app.disable('x-powered-by')

app.use(router)

app.use(handleErrors)

app.listen(PORT, async () => {
  logger.info(`🏁 ${config.get('appName')} listening on port ${PORT}`)

  // try {
  //   await client.connection()
  //   logger.info('successfully connected to mongodb')
  // } catch (err) {
  //   logger.error(err.toString())
  // }
})

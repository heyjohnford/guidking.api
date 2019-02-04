const express = require('express')
const cors = require('cors')
const { config, logger, socketHandler } = require('../lib')
const { requestMiddleware, handleErrors } = require('../helpers')
const { serverCloseEvents } = require('../constants')
const router = require('./router')

const PORT = config.get('env:port')
const app = express()

app.disable('x-powered-by')

app.use(requestMiddleware)
app.use(logger.logToStdout)
app.use(logger.logToFile)
app.use(cors())
app.use(router)
app.use(handleErrors)

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const namespaceIo = io.of('counter')
namespaceIo.on('connection', socketHandler)

serverCloseEvents.forEach((event) => {
  process.on(event, (err) => {
    logger.error(err.toString())
    server.close()
    process.exit(1)
  })
})

server.listen(PORT, () => {
  logger.info(`🏁 ${config.get('appName')} listening on port ${PORT}`)
  logger.info(`Node environment is ${config.get('nodeEnv')}`)
})

const logger = require('../lib/logger')
const repository = require('../src/repository')

function socketHandler(socket) {
  setInterval(async () => {
    try {
      const { total } = await repository.getTotalGuidCount()
      socket.emit('counter', { total })
    } catch (err) {
      logger.error(err.toString())
    }
  }, 5000)
}

module.exports = socketHandler

const logger = require('../lib/logger')
const Repository = require('../src/repository')

const { getTotalGuidCount } = new Repository()

function socketHandler(socket) {
  setInterval(async () => {
    try {
      const total = await getTotalGuidCount()
      socket.emit('counter', { total })
    } catch (err) {
      logger.error(err.toString())
    }
  }, 5000)
}

module.exports = socketHandler

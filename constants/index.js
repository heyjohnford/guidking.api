const config = require('../lib/config')

const serverCloseEvents = ['uncaughtException', 'SIGTERM']

module.exports = {
  serverCloseEvents,
  AMOUNT_OF_GUIDS_ALLOWED: config.get('app:numberOfGuidsAllowed')
}

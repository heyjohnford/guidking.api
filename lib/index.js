module.exports = {
  get config() { return require('./config') },
  get logger() { return require('./logger') },
  get client() { return require('./client') },
  get socketHandler() { return require('./socket') }
}

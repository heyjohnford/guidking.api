const path = require('path')
const nconf = require('nconf')
const tryRequire = require('try-require')

let config

function loadConfig() {
  if (config) {
    return config
  }

  const {
    NODE_ENV,
    APP_ENV,
    MONGO_HOST,
    MONGO_PWD } = process.env || {}

  const nodeEnv = NODE_ENV || 'development'
  const appEnv = APP_ENV || nodeEnv

  config = new nconf.Provider()

  config.env({
    lowerCase: true,
    parseValues: true,
    separator: '_'
  })

  const configPath = path.join(process.cwd(), 'config', `${appEnv}.json`)

  config.file({
    file: configPath
  })

  const defaults = tryRequire(path.join(process.cwd(), 'config', 'default.json'))

  if (defaults) {
    config.defaults(defaults)
  }

  config.required(['appName'])

  config.set('nodeEnv', nodeEnv)
  config.set('appEnv', appEnv)
  config.set('database:password', MONGO_PWD)
  config.set('database:host', MONGO_HOST || config.get('database:host'))

  return config
}

module.exports = loadConfig()

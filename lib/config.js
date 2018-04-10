const path = require('path')
const nconf = require('nconf')
const tryRequire = require('try-require')

let config

function loadConfig() {
  if (config) {
    return config
  }

  const nodeEnv = process.env.NODE_ENV || 'development'
  const appEnv = process.env.APP_ENV || nodeEnv

  config = new nconf.Provider()

  config.env({
    lowerCase: true,
    parseValues: true,
    separator: '__'
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

  return config
}

module.exports = loadConfig()

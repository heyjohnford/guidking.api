const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const { createLogger, format, transports } = require('winston')

// load in logger directory
const logDir = path.join(__dirname, '../log')

// ensure log directory exists
fs.existsSync(logDir) || fs.mkdirSync(logDir)

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '5d',
  path: logDir
})

const DEFAULT_MORGAN_FORMAT = ':requestId :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

function color(status) {
  if (status >= 500) {
    return chalk.red
  } else if (status >= 400) {
    return chalk.yellow
  } else if (status >= 300) {
    return chalk.cyan
  } else if (status >= 200) {
    return chalk.green
  }

  return chalk.grey
}

const levels = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  verbose: 'grey',
  debug: 'magenta',
  silly: 'inverse'
}


function setupWinstonLogger() {
  const { printf, combine, timestamp } = format
  const loggerFormat = printf(log => `${chalk[levels[log.level]](`[${log.level}]`)} ${log.message}`)
  return createLogger({
    format: loggerFormat,
    transports: [
      new transports.Console(),
      new transports.File({
        filename: path.join(__dirname, '../log', 'winston.log'),
        format: combine(timestamp(), format.simple())
      })
    ]
  })
}

class Logger {
  constructor(options = {}) {
    const template = options.template || DEFAULT_MORGAN_FORMAT

    this.options = options

    morgan.token('requestId', function getRequestId(req) {
      return req.requestId
    })

    this.logToStdout = morgan((tokens, req, res) => {
      const output = color(res.statusCode)
      const info = [
        'date',
        'method',
        'url'
      ].map(attr => tokens[attr](req, res)).join(' ')

      return output(`${info} (${tokens.status(req, res)}) ${tokens['response-time'](req, res)}ms`)
    })
    this.logToFile = morgan(template, { stream: accessLogStream })
    this.logger = this.logger || setupWinstonLogger()
  }

  setup(type) {
    switch (type) {
      case 'file':
        return this.logToFile
      default:
        return this.logToStdout
    }
  }

  debug(...args) {
    this.logger.debug(...args)
  }

  info(...args) {
    this.logger.info(...args)
  }

  log(...args) {
    this.logger.info(...args)
  }

  warn(...args) {
    this.logger.warn(...args)
  }

  error(...args) {
    this.logger.error(...args)
  }
}

const logger = new Logger()

module.exports = logger

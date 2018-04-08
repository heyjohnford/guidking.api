const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const rfs = require('rotating-file-stream')
const chalk = require('chalk')

// load in logger directory
const logDir = path.join(__dirname, '../log')

// ensure log directory exists
fs.existsSync(logDir) || fs.mkdirSync(logDir)

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDir
})

function colorFormat(status) {
  if (status >= 500) {
    return chalk.red
  } else if (status >= 400) {
    return chalk.yellow
  } else if (status >= 300) {
    return chalk.cyan
  } else if (status >= 200) {
    return chalk.green
  }

  return status
}

class Logger {
  constructor(options = {}) {
    if (this.logToStdout) {
      return
    }

    const template = options.template || 'combined'

    this.options = options
    this.logToStdout = morgan((tokens, req, res) => {
      const color = colorFormat(res.statusCode)
      const info = [
        'date',
        'method',
        'url'
      ].map(attr => tokens[attr](req, res)).join(' ')

      return color(`${info} (${tokens.status(req, res)}) ${tokens['response-time'](req, res)}ms`)
    })
    this.logToFile = morgan(template, { stream: accessLogStream })
    this.logger = console
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
    this.logger.debug(...args);
  }

  info(...args) {
    this.logger.info(...args);
  }

  log(...args) {
    this.logger.log(...args)
  }

  warn(...args) {
    this.logger.warn(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }
}

module.exports = Logger

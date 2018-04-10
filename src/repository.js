const { logger } = require('../lib/logger')

class Repository {
  static async createGuid(payload, amount, responseTime) {
    const { requestId, ip, url, headers } = payload
    const guid = {
      requestId,
      ip,
      url,
      responseTime,
      numberOfGuids: amount,
      userAgent: headers['user-agent']
    }

    logger.info(`${requestId} guid entry request saved!`)
  }

  // async updateTotalGuidCount(amount) {
  // }
}

module.exports = Repository

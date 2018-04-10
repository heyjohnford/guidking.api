class Repository {
  async createGuid(payload, amount, responseTime) {
    const { requestId, ip, url, headers } = payload
    const guid = {
      requestId,
      ip,
      url,
      responseTime,
      numberOfGuids: amount,
      userAgent: headers['user-agent']
    }
  }

  async updateTotalGuidCount(amount) {

  }
}

module.exports = Repository

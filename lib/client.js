const { MongoClient } = require('mongodb')
const config = require('./config')

const { url, options } = config.get('database')

class Client {
  constructor() {
    this.cachedClient = null
  }

  async connection() {
    if (this.cachedClient) {
      return this.cachedClient
    }

    const client = await MongoClient.connect(url, options)
    this.cachedClient = client

    return client
  }

  get getClient() {
    return this.cachedClient
  }
}

module.exports = new Client()

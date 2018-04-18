const { MongoClient } = require('mongodb')
const config = require('./config')

const { url, options } = config.get('database')

class Client {
  constructor() {
    this.cachedClient = null
  }

  async connection() {
    if (!this.cachedClient) {
      this.cachedClient = await MongoClient.connect(url, options)
    }

    return this.cachedClient
  }

  get getClient() {
    if (!this.cachedClient) {
      throw new Error('Run mongo client connection before calling the getter')
    }

    return this.cachedClient
  }
}

module.exports = new Client()

const { MongoClient } = require('mongodb')
const config = require('./config')


function getStoreConfig() {
  const { url, host, user, password, name, port, options } = config.get('database')

  return {
    url: `${url}${user}:${password}@${host}:${port}/${name}`,
    options: options || {}
  }
}

class Client {
  constructor() {
    this.cachedClient = null
  }

  async connection() {
    if (!this.cachedClient) {
      const { url, options } = getStoreConfig()
      this.cachedClient = await MongoClient.connect(url, options)
    }

    return this.cachedClient
  }

  async getClient() {
    if (!this.cachedClient) {
      throw new Error('Run mongo client connection before calling the getter')
    }

    return this.cachedClient
  }
}

module.exports = new Client()

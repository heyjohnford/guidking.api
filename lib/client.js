const { MongoClient } = require('mongodb')
const config = require('./config')


function getStoreConfig() {
  const { url: mongoUrl, host, user, password, name, port, options } = config.get('database')
  let url = `${mongoUrl}${user}:${password}@${host}:${port}/${name}`

  if (config.get('nodeEnv') !== 'production') {
    url = `${mongoUrl}${host}:${port}/${name}`
  }

  return {
    url,
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

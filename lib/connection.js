const { MongoClient } = require('mongodb')
const config = require('./config')

const { url, options } = config.get('database')

let cachedClient

// Use connect method to establish connection to the mongo client
async function connection() {
  if (cachedClient) {
    return cachedClient
  }

  const client = await MongoClient.connect(url, options)
  cachedClient = client

  return client
}

module.exports = connection

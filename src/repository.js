const { config, connection, logger } = require('../lib')

let cachedDb

class Repository {
  constructor() {
    this.dbName = config.get('database:name')
  }

  async getDb() {
    if (cachedDb) {
      return cachedDb
    }

    const client = await connection()
    const db = client.db(this.dbName)

    logger.info(`using ${this.dbName} for mongodb context`)

    cachedDb = db

    return db
  }

  async getCollectionByName(collectionName) {
    const db = await this.getDb()
    return db.collection(collectionName)
  }

  async insertOne(payload) {
    const { requestId } = payload
    const collection = await this.getCollectionByName('transactions')

    return collection.insertOne({ _id: requestId, ...payload })
  }
}

module.exports = new Repository()

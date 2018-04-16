const { config, client: dbClient, logger } = require('../lib')

function removeRequestIdFromBody(payload) {
  const { requestId, ...payloadOmitRequestId } = payload
  return payloadOmitRequestId
}

async function setupCollections(db, collectionName) {
  await db.createCollection(collectionName)
  logger.info(`${collectionName} collection created`)

  await db.createIndex(collectionName, 'numberOfGuids', { background: true })
  logger.info(`index on ${collectionName}.numberOfGuids field created`)

  await db.createCollection('total_guids', {
    viewOn: collectionName,
    pipeline: [{ $group: { _id: null, total: { $sum: '$numberOfGuids' } } }]
  })
  logger.info('total_guids view created')
}

class Repository {
  constructor() {
    this.dbName = config.get('database:name')
    this.cachedDb = null
  }

  async getDb() {
    if (this.cachedDb) {
      return this.cachedDb
    }

    const client = dbClient.getClient
    const db = client.db(this.dbName)

    logger.info(`using ${this.dbName} for database context`)

    try {
      const collectionName = 'transactions'
      await setupCollections(db, collectionName)
    } catch (err) {
      logger.error(err.toString())
    }

    this.cachedDb = db

    return db
  }

  async getCollectionByName(collectionName) {
    const db = await this.getDb()
    return db.collection(collectionName)
  }

  async insertOne(payload) {
    const collection = await this.getCollectionByName('transactions')
    const body = removeRequestIdFromBody(payload)

    return collection.insertOne({
      _id: payload.requestId,
      ...body,
      createdAt: new Date()
    })
  }
}

module.exports = new Repository()

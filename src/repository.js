const { config, client, logger } = require('../lib')

const TRANSACTIONS_COLL = 'transactions'
const TOTAL_GUIDS_COLL = 'total_guids'

function removeRequestIdFromBody(payload) {
  const { requestId, ...payloadOmitRequestId } = payload
  return payloadOmitRequestId
}

class Repository {
  constructor() {
    this.dbName = config.get('database:name')
    this.cachedDb = null
  }

  async setupCollections(collectionName) {
    await this.cachedDb.createCollection(collectionName)
    logger.info(`${collectionName} collection created`)

    await this.cachedDb.createIndex(collectionName, 'numberOfGuids', { background: true })
    logger.info(`index on ${collectionName}.numberOfGuids field created`)

    await this.cachedDb.createCollection(TOTAL_GUIDS_COLL, {
      viewOn: collectionName,
      pipeline: [{ $group: { _id: null, total: { $sum: '$numberOfGuids' } } }]
    })
    logger.info('total_guids view created')
  }

  async getDb() {
    if (!this.cachedDb) {
      const mongoClient = await client.connection()
      const db = mongoClient.db(this.dbName)

      this.cachedDb = db

      logger.info(`using ${this.dbName} for database context`)

      try {
        const collectionName = TRANSACTIONS_COLL
        await this.setupCollections(collectionName)
      } catch (err) {
        logger.error(err.toString())
      }
    }

    return this.cachedDb
  }

  async getCollectionByName(collectionName) {
    const db = await this.getDb()
    return db.collection(collectionName)
  }

  async insertOne(payload) {
    const collection = await this.getCollectionByName(TRANSACTIONS_COLL)
    const body = removeRequestIdFromBody(payload)

    return collection.insertOne({
      _id: payload.requestId,
      ...body,
      createdAt: new Date()
    })
  }

  async getTotalGuidCount() {
    const collection = await this.getCollectionByName(TOTAL_GUIDS_COLL)
    return collection.findOne({}, { fields: { _id: 0, total: 1 } })
  }
}

module.exports = new Repository()

/* eslint no-underscore-dangle: "off" */
const sinon = require('sinon')
const assert = require('assert')
const repository = require('../../src/repository')
const { client, logger } = require('../../lib')

describe('#Repository Test', function () {
  const sandbox = sinon.sandbox.create()

  beforeEach(function () {
    logger.info = sandbox.stub()
    logger.error = sandbox.stub()
  })

  describe('Constructor', function () {
    it('should build out repository constructor properly', function () {
      const { cachedDb, dbName } = repository

      assert.deepStrictEqual('guidking', dbName)
      assert.strictEqual(null, cachedDb)
    })
  })

  describe('Returns db', function () {
    it('should get the db from the store\'s client', async function () {
      const mockDb = {
        guid_king: { transactions: {} }
      }

      sandbox.stub(client, 'connection').resolves({ db: () => mockDb })
      sandbox.stub(repository, 'setupCollections').resolves()

      const db = await repository.getDb()

      assert.deepEqual({}, db.guid_king.transactions)
    })
  })

  describe('Db fail', function () {
    it('should fail when trying to get the db', async function () {
      sandbox.stub(client, 'connection').throws(new Error('Failed to connect to the db'))

      try {
        await repository.getDb()
      } catch (err) {
        assert.deepStrictEqual('Failed to connect to the db', err)
      }
    })
  })

  describe('Insert guid', function () {
    it('should insert, sanitize and return guid', async function () {
      const insertOneSpy = sandbox.spy(repository, 'insertOne')
      const actual = {
        requestId: 100,
        ip: '127.0.0.1',
        url: 'http://localhost',
        responseTime: 5.05,
        numberOfGuids: 1,
        userAgent: 'Chrome'
      }
      const expected = {
        _id: actual.requestId,
        ip: actual.ip,
        url: actual.url,
        responseTime: actual.responseTime,
        numberOfGuids: actual.numberOfGuids,
        userAgent: actual.userAgent,
        createdAt: new Date()
      }

      sandbox.stub(repository, 'getCollectionByName').resolves({
        insertOne: sandbox.stub().withArgs(expected).resolves(expected)
      })

      const result = await repository.insertOne(actual)

      assert.strictEqual(true, insertOneSpy.calledOnce)
      assert.deepEqual(Object.keys(expected), Object.keys(result))
    })
  })

  afterEach(function () {
    sandbox.restore()
  })
})

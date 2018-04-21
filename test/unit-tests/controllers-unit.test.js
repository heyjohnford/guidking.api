/* eslint no-underscore-dangle: "off" */
const controllers = require('../../src/contoller')
const sinon = require('sinon')
const assert = require('assert')
const repository = require('../../src/repository')
const { client, logger } = require('../../lib')
const MockExpressRequest = require('mock-express-request')
const MockExpressResponse = require('mock-express-response')

describe('#Controllers Test', function () {
  describe('GET guids', function () {
    it('should get a list of specified guids', async function () {
      const req = new MockExpressRequest({ query: { amount: 15 } })
      const res = new MockExpressResponse()
      const next = () => {}

      // Disregard dependent libraries/helpers
      sinon.stub(repository, 'insertOne').resolves({})
      sinon.stub(logger, 'info').returns(() => {})
      sinon.stub(client, 'connection').resolves({})

      await controllers.getGuids(req, res, next)
      const result = res._getJSON()

      assert.strictEqual(200, res.statusCode)
      assert.strictEqual(15, result.length)
      assert.equal(true, Array.isArray(result))
    })
  })
})
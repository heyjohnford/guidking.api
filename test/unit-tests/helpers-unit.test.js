/* eslint no-underscore-dangle: "off" */
const helpers = require('../../helpers')
const sinon = require('sinon')
const assert = require('assert')
const MockExpressRequest = require('mock-express-request')
const MockExpressResponse = require('mock-express-response')

describe('#Helpers Test', function () {
  describe('Generate guids', function () {
    it('should generate the correct amount of guids', async function () {
      const result = await helpers.generateUuid(5)

      assert.equal(true, Array.isArray(result))
      assert.equal(true, result.every(guid => guid.length === 36))
      assert.strictEqual(result.length, 5)
    })
  })

  describe('Handle errors', function () {
    it('should handle errors providing status, name, message', function () {
      const req = new MockExpressRequest()
      const res = new MockExpressResponse()
      const next = () => {}

      const err = new Error('invalid request test')
      err.statusCode = 400

      const expectedError = {
        error: true,
        type: 'Error',
        message: 'invalid request test'
      }

      helpers.handleErrors(err, req, res, next)

      const result = res._getJSON()

      assert.strictEqual(400, res.statusCode)
      assert.deepEqual(expectedError, result)
    })
  })

  describe('Request middleware', function () {
    it('should setup middleware properties providing startAt (time) and requestId', function () {
      const req = new MockExpressRequest()
      const res = new MockExpressResponse()
      const next = () => {}

      helpers.requestMiddleware(req, res, next)

      assert.equal(true, !Number.isNaN(req.startAt))
      assert.strictEqual(36, req.requestId.length)
    })
  })

  describe('Response time', function () {
    it('should calculate the response time from request start to request finish', function () {
      const result = helpers.responseTime(process.hrtime())

      assert.equal(true, !Number.isNaN(result))
    })
  })

  describe('Retry', function () {
    it('should retry a function for a declared number of times with a delay between retries', async function () {
      const func = sinon.stub().resolves('Hello, World')

      const result = await helpers.retry(func, 3, 200)

      assert.strictEqual('Hello, World', result)
      assert.equal(true, func.calledOnce)
    })

    it('should retry a function and ultimately fail due to exceeding retries', async function () {
      const func = sinon.stub().throws(new Error('Oh no, I failed :('))

      try {
        await helpers.retry(func, 3, 200)
      } catch (err) {
        assert.strictEqual('request retries (3) exceed maximum allowed', err.message)
        assert.strictEqual('Oh no, I failed :(', func.exceptions[0].message)
        assert.strictEqual(4, func.callCount)
      }
    })
  })
})

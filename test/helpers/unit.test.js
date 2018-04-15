const helpers = require('../../helpers')
const assert = require('assert')

describe('#Helpers Test', function () {
  it('should generate the correct amount of guids', async function () {
    const guids = await helpers.generateUuid(5)

    assert.equal(true, Array.isArray(guids))
    assert.equal(true, guids.every(guid => guid.length === 36))
    assert.equal(guids.length, 5)
  })
})

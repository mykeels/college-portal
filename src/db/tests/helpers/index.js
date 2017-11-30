const { assert } = require('chai')

export const isDataProxy = (proxy) => {
    assert.isNotNull(proxy)
    assert.isFunction(proxy.destroy)
    assert.isFunction(proxy.getAll)
    assert.isFunction(proxy.getById)
    assert.isFunction(proxy.getSingle)
    assert.isFunction(proxy.insert)
    assert.isFunction(proxy.update)
    assert.isFunction(proxy.exists)
}

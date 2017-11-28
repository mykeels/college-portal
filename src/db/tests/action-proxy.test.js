const {assert} = require('chai')

import db, { Action } from '../'

import GetProxy from '../proxies'

const { ActionProxy, Events } = GetProxy(db, { Action })

const isDataProxy = (proxy = ActionProxy) => {
    assert.isNotNull(proxy)
    assert.isFunction(proxy.destroy)
    assert.isFunction(proxy.getAll)
    assert.isFunction(proxy.getById)
    assert.isFunction(proxy.insert)
    assert.isFunction(proxy.update)
}

describe('ActionProxy', () => {
    it('should be a valid Data Proxy', () => {
        isDataProxy(ActionProxy)
    })

    it('getById(-1) should return NULL', () => {
        ActionProxy.getById(-1, (action) => {
            assert.isNull(action)
        })
    })
    
    it('insert(action) should work', () => {
        ActionProxy.insert({
            name: 'create-user',
            description: 'This user can create another'
        }, (err, action) => {
            if (err) {
                assert.equal(err.name, 'SequelizeUniqueConstraintError')
            }
            else {
                assert.isNotNull(action)
                assert.isNotNull(action.dataValues)
            }
        }).catch(err => {
            console.error(err.name)
        })
    })
})

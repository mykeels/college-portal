import db, { Action } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { ActionProxy, Events } = GetProxy(db, { Action })

const ACTION_NAME = 'create-user'

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
        ActionProxy.getById(-1, (err, action) => {
            assert.isNull(err)
            assert.isNull(action)
        })
    })
    
    it('getAll() should return items', () => {
        ActionProxy.getAll((err, actions) => {
            assert.isNull(err)
            assert.isArray(actions)
            actions.forEach(action => {
                assert.isTrue(!!action.id)
                assert.isTrue(!!action.name)
            })
        })
    })
    
    it('insert(action) should work', () => {
        ActionProxy.insert({
            name: ACTION_NAME,
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

    it(`getById(1) should return an action "${ACTION_NAME}"`, () => {
        ActionProxy.getById(1, (err, savedAction) => {
            assert.isNull(err)
            if (savedAction) {
                assert.equal(savedAction.dataValues.name, ACTION_NAME)
            }
        })
    })
    
    it(`destroy(1) should return a boolean`, () => {
        ActionProxy.destroy(1, (err, savedAction) => {
            assert.isNull(err)
            assert.isTrue(savedAction)
        })
    })
})

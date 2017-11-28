import db, { Action } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { ActionProxy, Events } = GetProxy({ Action })

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
        ActionProxy.getById(-1).then((action) => {
            assert.isNull(action)
        }).catch(err => {
            assert.isNull(err)
        })
    })
    
    it(`getById(1) should return an action "${ACTION_NAME}"`, () => {
        ActionProxy.getById(31).then(savedAction => {
            if (savedAction) {
                assert.equal(savedAction.name, ACTION_NAME)
            }
        }).catch(err => {
            assert.isNull(err)
        })
    })
    
    it('getAll() should return items', () => {
        ActionProxy.getAll({}).then((actions) => {
            assert.isArray(actions)
            actions.forEach(action => {
                assert.isDefined(action)
                assert.isDefined(!!action.id)
                assert.isDefined(!!action.name)
            })
        }).catch(err => {
            assert.isNull(err)
        })
    })
    
    it('insert(action) should work', () => {
        ActionProxy.insert({
            name: ACTION_NAME,
            description: 'This user can create another'
        }).then(action => {
            assert.isNotNull(action)
            assert.isNotNull(action.dataValues)
        }).catch(err => {
            assert.equal(err.name, 'SequelizeUniqueConstraintError')
        })
    })
    
    it('insert(action) should work', () => {
        ActionProxy.insert({
            name: ACTION_NAME,
            description: 'This user can create another'
        }).then(action => {
            assert.isNotNull(action)
            assert.isNotNull(action.dataValues)
        }).catch(err => {
            assert.equal(err.name, 'SequelizeUniqueConstraintError')
        })
    })
    
    it(`destroy(31) should return a boolean`, () => {
        ActionProxy.destroy(31, (err, savedAction) => {
            assert.isNull(err)
            assert.isTrue(savedAction)
        })
    })
})

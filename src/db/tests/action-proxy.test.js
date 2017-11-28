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
    const getLastAction = () => {
        return ActionProxy.getAll({
            limit: 1,
            order: [ [ 'createdAt', 'DESC' ]]
        }).then(actions => {
            const lastAction = actions[0]
            assert.isDefined(lastAction)
            return lastAction
        })
    }

    it('should be a valid Data Proxy', () => {
        return isDataProxy(ActionProxy)
    })
    
    it('insert(action) should work', () => {
        return ActionProxy.insert({
            name: ACTION_NAME,
            description: 'This user can create another'
        }).then(action => {
            assert.isNotNull(action)
            assert.isNotNull(action.dataValues)
        }).catch(err => {
            assert.equal(err.name, 'SequelizeUniqueConstraintError')
        })
    })

    it('getById(-1) should return NULL', () => {
        return ActionProxy.getById(-1).then((action) => {
            assert.isNull(action)
        }).catch(err => {
            assert.isNull(err)
        })
    })
    
    it(`getById(id) should return an action "${ACTION_NAME}"`, () => {
        return getLastAction().then(lastAction => {
            ActionProxy.getById(lastAction.id).then(savedAction => {
                if (savedAction) {
                    assert.equal(savedAction.name, ACTION_NAME)
                }
            }).catch(err => {
                assert.isNull(err)
            })
        })
    })
    
    it('getAll() should return items', () => {
        return ActionProxy.getAll({}).then((actions) => {
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
    
    it('update(action) should work', () => {
        return getLastAction().then(lastAction => {
            ActionProxy.update({
                id: lastAction.id,
                name: `${ACTION_NAME}-modified`
            }).then(rows => {
                assert.isArray(rows)
            }).catch(err => {
                assert.equal(err.name, 'SequelizeUniqueConstraintError')
            })
        }).catch(err => {
            assert.isNull(err, 'update(action)')
        })
    })
    
    it(`destroy(id) should return a boolean`, () => {
        return getLastAction().then(lastAction => {
            ActionProxy.destroy(lastAction.id, (err, savedAction) => {
                assert.isNull(err)
                assert.isTrue(savedAction)
            })
        })
    })
})

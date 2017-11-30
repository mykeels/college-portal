import db, { Action } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { ActionProxy, Events } = GetProxy({ Action })

const ACTION_NAME = 'create-user'

const { isDataProxy } = require('./helpers')

describe('ActionProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        return isDataProxy(ActionProxy)
    })

    describe('Inserts', () => {
        /**
         * We check that all INSERT constraints are obeyed
         */
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

        describe('Selects and Updates', () => {
            const getLastAction = () => {
                /**
                 * retrieve the last added action
                 */
                return ActionProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(actions => {
                    const lastAction = actions[0]
                    assert.isDefined(lastAction)
                    return lastAction
                })
            }

            /**
             * We check that all SELECT and UPDATE operations work
             */

            it('getById(-1) should return NULL', () => {
                return ActionProxy.getById(-1).then((action) => {
                    assert.isNull(action)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an action "${ACTION_NAME}"`, () => {
                return getLastAction().then(lastAction => {
                    return ActionProxy.getById(lastAction.id).then(savedAction => {
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
                    return ActionProxy.update({
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

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastAction().then(lastAction => {
                        return ActionProxy.destroy(lastAction.id).then((success) => {
                            assert.equal(success, 1)
                        }).catch(err => {
                            assert.isNull(err)
                        })
                    })
                })
            })
        })
    })
    
    

    
    
    
})

import db, { Action, UserType, Role, RolePerformsAction } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { ActionProxy, RoleProxy, UserTypeProxy, RolePerformsActionProxy, Events } = GetProxy({ Action, Role, UserType, RolePerformsAction })

const USER_EMAIL = 'abc@mailinator.com', USER_PASSWORD = 'password', USER_GENDER = 'male'
const ROLE_NAME = 'student', ACTION_NAME = 'create-list'

const { isDataProxy } = require('./helpers')

describe('RolePerformsActionProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        isDataProxy(ActionProxy)
        isDataProxy(UserTypeProxy)
        isDataProxy(RoleProxy)
        return isDataProxy(RolePerformsActionProxy)
    })

    describe('Inserts', () => {

        let createdAction = null, createdRole = null, createdUserType = null

        before(() => {
            /**
             * create the user, then role to be used in tests
             */
            return UserTypeProxy.insert({
                name: ROLE_NAME
            }).then(userType => {
                createdUserType = userType

                return RoleProxy.insert({
                    name: ROLE_NAME,
                    userTypeId: userType.id
                })
                .then(role => {
                    createdRole = role
    
                    return ActionProxy.insert({
                        name: ACTION_NAME
                    })
                    .then(action => {
                        createdAction = action
                    })
                    .catch(err => {
                        throw err
                    })
                })
                .catch(err => {
                    throw err
                })
            }).catch(err => {
                throw err
            })
            
        })

        after(() => {
            /**
             * delete the user, then role that was created before all tests
             */
            return ActionProxy.destroy(createdAction.id).then(success => {
                return RoleProxy.destroy(createdRole.id).then(success => {
                    return UserTypeProxy.destroy(createdUserType.id).then(success => {
                        
                    }).catch(err => {
                        throw err
                    })
                }).catch(err => {
                    throw err
                })
            }).catch(err => {
                throw err
            })
        })

        /**
         * We check that all INSERT constraints are obeyed
         */
        it('insert(rolePerformsAction) should work', () => {
            return RolePerformsActionProxy.insert({
                roleId: createdRole.id,
                actionId: createdAction.id
            }).then(user => {
                assert.isNotNull(user)
            }).catch(err => {
                assert.fail()
            })
        })

        describe('Selects and Updates', () => {
            const getLastRolePerformsAction = () => {
                /**
                 * retrieve the last added action
                 */
                return RolePerformsActionProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(users => {
                    const lastUser = users[0]
                    assert.isDefined(lastUser)
                    return lastUser
                })
            }

            /**
             * We check that all SELECT and UPDATE operations work
             */

            it('getById(-1) should return NULL', () => {
                return RolePerformsActionProxy.getById(-1).then((rolePerformsAction) => {
                    assert.isNull(rolePerformsAction)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return a userHasRole`, () => {
                return getLastRolePerformsAction().then(lastUser => {
                    return RolePerformsActionProxy.getById(lastUser.id).then(rolePerformsAction => {
                        if (rolePerformsAction) {
                            assert.equal(rolePerformsAction.actionId, createdAction.id)
                            assert.equal(rolePerformsAction.roleId, createdRole.id)
                        }
                    }).catch(err => {
                        assert.isNull(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return RolePerformsActionProxy.getAll({}).then((rolePerformsActions) => {
                    assert.isArray(rolePerformsActions)
                    rolePerformsActions.forEach(rolePerformsAction => {
                        assert.isDefined(rolePerformsAction)
                        assert.isDefined(rolePerformsAction.actionId)
                        assert.isDefined(rolePerformsAction.roleId)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(rolePerformsAction) with actionId = -1 should throw ActionNotExistsError', () => {
                return getLastRolePerformsAction().then(lastRolePerformsAction => {
                    return RolePerformsActionProxy.update({
                        id: lastRolePerformsAction.id,
                        roleId: createdRole.id,
                        actionId: -1
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.equal(err.name, 'ActionNotExistsError')
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(rolePerformsAction)')
                })
            })
            
            it('update(rolePerformsAction) with roleId = -1 should throw RoleNotExistsError', () => {
                return getLastRolePerformsAction().then(lastRolePerformsAction => {
                    return RolePerformsActionProxy.update({
                        id: lastRolePerformsAction.id,
                        actionId: createdAction.id,
                        roleId: -1
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.equal(err.name, 'RoleNotExistsError')
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(rolePerformsAction)')
                })
            })

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastRolePerformsAction().then(lastRolePerformsAction => {
                        return RolePerformsActionProxy.destroy(lastRolePerformsAction.id).then((success) => {
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

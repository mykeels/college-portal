import db, { User, UserType, Role, UserHasRole } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserProxy, RoleProxy, UserTypeProxy, UserHasRoleProxy, Events } = GetProxy({ User, Role, UserType, UserHasRole })

const USER_EMAIL = 'abc@mailinator.com', USER_PASSWORD = 'password', USER_PASSWORD2 = 'password2', USER_GENDER = 'male'
const ROLE_NAME = 'student'

const { isDataProxy } = require('./helpers')

describe('UserHasRoleProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        isDataProxy(UserProxy)
        isDataProxy(RoleProxy)
        return isDataProxy(UserHasRoleProxy)
    })

    describe('Inserts', () => {

        let createdUser = null, createdRole = null, createdUserType = null

        before(() => {
            /**
             * create the user, then role to be used in tests
             */
            return UserTypeProxy.insert({
                name: ROLE_NAME
            }).then(userType => {
                createdUserType = userType

                return UserProxy.insert({
                    email: USER_EMAIL,
                    pwd: USER_PASSWORD,
                    gender: USER_GENDER
                })
                .then(user => {
                    createdUser = user
    
                    return RoleProxy.insert({
                        name: ROLE_NAME,
                        userTypeId: createdUserType.id
                    })
                    .then(role => {
                        createdRole = role
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
            return UserProxy.destroy(createdUser.id).then(success => {
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
        it('insert(user) should work', () => {
            return UserHasRoleProxy.insert({
                userId: createdUser.id,
                roleId: createdRole.id
            }).then(user => {
                assert.isNotNull(user)
            }).catch(err => {
                assert.fail()
            })
        })

        describe('Selects and Updates', () => {
            const getLastUserHasRole = () => {
                /**
                 * retrieve the last added action
                 */
                return UserHasRoleProxy.getAll({
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
                return UserHasRoleProxy.getById(-1).then((userHasRole) => {
                    assert.isNull(userHasRole)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return a userHasRole`, () => {
                return getLastUserHasRole().then(lastUser => {
                    return UserHasRoleProxy.getById(lastUser.id).then(savedUser => {
                        if (savedUser) {
                            assert.equal(savedUser.userId, createdUser.id)
                            assert.equal(savedUser.roleId, createdRole.id)
                        }
                    }).catch(err => {
                        assert.isNull(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return UserHasRoleProxy.getAll({}).then((userHasRoles) => {
                    assert.isArray(userHasRoles)
                    userHasRoles.forEach(userHasRole => {
                        assert.isDefined(userHasRole)
                        assert.isDefined(userHasRole.userId)
                        assert.isDefined(userHasRole.roleId)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(userHasRole) with userId = -1 should throw UserNotExistsError', () => {
                return getLastUserHasRole().then(lastUserHasRole => {
                    return UserHasRoleProxy.update({
                        id: lastUserHasRole.id,
                        userId: -1
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.equal(err.name, 'UserNotExistsError')
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(userHasRole)')
                })
            })
            
            it('update(userHasRole) with roleId = -1 should throw RoleNotExistsError', () => {
                return getLastUserHasRole().then(lastUserHasRole => {
                    return UserHasRoleProxy.update({
                        id: lastUserHasRole.id,
                        roleId: -1
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.equal(err.name, 'RoleNotExistsError')
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(userHasRole)')
                })
            })

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastUserHasRole().then(lastUserHasRole => {
                        return UserHasRoleProxy.destroy(lastUserHasRole.id).then((success) => {
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

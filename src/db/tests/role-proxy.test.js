import db, { UserType, Role } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserTypeProxy, RoleProxy, Events } = GetProxy({ Role, UserType })

const ROLE_NAME = 'student', ROLE_NAME2 = 'staff'

const { isDataProxy } = require('./helpers')

describe('RoleProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        return isDataProxy(RoleProxy)
    })

    describe('Create UserType then Inserts', () => {

        let createdUserType = null

        before(() => {
            /**
             * create the user that has the phone-number
             */
            return UserTypeProxy.insert({
                name: ROLE_NAME
            })
            .then(userType => {
                createdUserType = userType
            })
            .catch(err => {
                throw err
            })
        })

        after(() => {
            /**
             * delete the userType that was created before all tests
             */
            return UserTypeProxy.destroy(createdUserType.id).then(success => {
                
            }).catch(err => {
                throw err
            })
        })

        /**
         * We check that all INSERT constraints are obeyed
         */
        it('insert(role) without userTypeId should throw NullParamError', () => {
            return RoleProxy.insert({
                name: ROLE_NAME
            }).then(role => {
                assert.isNotNull(role)
            }).catch(err => {
                assert.equal(err.name, 'NullParamError')
            })
        })

        it('insert(role) with userTypeId should work', () => {
            return RoleProxy.insert({
                name: ROLE_NAME,
                userTypeId: createdUserType.id
            }).then(role => {
                assert.isNotNull(role)
            }).catch(err => {
                throw err
            })
        })

        describe('Selects and Updates', () => {
            const getLastRole = () => {
                /**
                 * retrieve the last added action
                 */
                return RoleProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(roles => {
                    const lastRole = roles[0]
                    assert.isDefined(lastRole)
                    return lastRole
                })
            }

            /**
             * We check that all SELECT and UPDATE operations work
             */

            it('getById(-1) should return NULL', () => {
                return RoleProxy.getById(-1).then((role) => {
                    assert.isNull(role)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an user "${ROLE_NAME}"`, () => {
                return getLastRole().then(lastRole => {
                    return RoleProxy.getById(lastRole.id).then(savedRole => {
                        if (savedRole) {
                            assert.equal(savedRole.name, ROLE_NAME)
                        }
                    }).catch(err => {
                        assert.isNull(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return RoleProxy.getAll({}).then((roles) => {
                    assert.isArray(roles)
                    roles.forEach(role => {
                        assert.isDefined(role)
                        assert.isDefined(role.name)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(role) should work', () => {
                return getLastRole().then(lastRole => {
                    return RoleProxy.update({
                        id: lastRole.id,
                        name: `${ROLE_NAME}`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.fail()
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(role)')
                })
            })

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastRole().then(lastRole => {
                        return RoleProxy.destroy(lastRole.id).then((success) => {
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

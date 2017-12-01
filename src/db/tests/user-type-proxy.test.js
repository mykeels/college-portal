import db, { UserType } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserTypeProxy, Events } = GetProxy({ UserType })

const { isDataProxy } = require('./helpers')

const USER_TYPE_NAME = 'student'
const USER_TYPE_NAME2 = 'staff'

describe('UserTypeProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        return isDataProxy(UserTypeProxy)
    })

    describe('Inserts', () => {
        /**
         * We check that all INSERT constraints are obeyed
         */
        it('insert(userType) should work', () => {
            return UserTypeProxy.insert({
                name: USER_TYPE_NAME
            }).then(user => {
                assert.isNotNull(user)
            }).catch(err => {
                assert.fail()
            })
        })

        describe('Selects and Updates', () => {
            const getLastUserType = () => {
                /**
                 * retrieve the last added action
                 */
                return UserTypeProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(users => {
                    const lastUserType = users[0]
                    assert.isDefined(lastUserType)
                    return lastUserType
                })
            }

            /**
             * We check that all SELECT and UPDATE operations work
             */

            it('getById(-1) should return NULL', () => {
                return UserTypeProxy.getById(-1).then((user) => {
                    assert.isNull(user)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an userType "${USER_TYPE_NAME}"`, () => {
                return getLastUserType().then(lastUserType => {
                    return UserTypeProxy.getById(lastUserType.id).then(savedUserType => {
                        if (savedUserType) {
                            assert.equal(savedUserType.name, USER_TYPE_NAME)
                        }
                    }).catch(err => {
                        assert.isNull(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return UserTypeProxy.getAll({}).then((users) => {
                    assert.isArray(users)
                    users.forEach(user => {
                        assert.isDefined(user)
                        assert.isDefined(user.name)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(userType) should work', () => {
                return getLastUserType().then(lastUserType => {
                    return UserTypeProxy.update({
                        id: lastUserType.id,
                        name: `${USER_TYPE_NAME2}`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.fail()
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(userType)')
                })
            })

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastUserType().then(lastUserType => {
                        return UserTypeProxy.destroy(lastUserType.id).then((success) => {
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


import db, { User, UserType, UserHasType } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserProxy, UserTypeProxy, UserHasTypeProxy, Events } = GetProxy({ User, UserHasType, UserType })

const USER_EMAIL = 'abc@mailinator.com', USER_PASSWORD = 'password', USER_PASSWORD2 = 'password2', USER_GENDER = 'male'
const ROLE_NAME = 'student', ROLE_NAME2 = 'staff'

const { isDataProxy } = require('./helpers')

describe('UserHasTypeProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        isDataProxy(UserProxy)
        isDataProxy(UserTypeProxy)
        return isDataProxy(UserHasTypeProxy)
    })

    describe('Create UserType and User then Inserts', () => {

        let createdUserType = null, createdUser = null

        before(() => {
            /**
             * create the user that has the phone-number
             */
            return UserTypeProxy.insert({
                name: ROLE_NAME
            })
            .then(userType => {
                createdUserType = userType

                return UserProxy.insert({
                    email: USER_EMAIL,
                    pwd: USER_PASSWORD,
                    gender: USER_GENDER
                })
                .then(user => {
                    createdUser = user
                })
                .catch(err => {
                    throw err
                })
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
                return UserProxy.destroy(createdUser.id).then(success => {
                    
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
        it('insert(userHasType) without userTypeId should throw NullParamError', () => {
            return UserHasTypeProxy.insert({
                userId: createdUser.id
            }).then(userHasType => {
                assert.isNotNull(userHasType)
            }).catch(err => {
                assert.equal(err.name, 'NullParamError')
            })
        })

        it('insert(userHasType) without userId should throw NullParamError', () => {
            return UserHasTypeProxy.insert({
                userTypeId: createdUserType.id
            }).then(userHasType => {
                assert.isNotNull(userHasType)
            }).catch(err => {
                assert.equal(err.name, 'NullParamError')
            })
        })

        it('insert(userHasType) with userTypeId and userId should work', () => {
            return UserHasTypeProxy.insert({
                userTypeId: createdUserType.id,
                userId: createdUser.id
            }).then(userHasType => {
                assert.isNotNull(userHasType)
            }).catch(err => {
                throw err
            })
        })

        describe('Selects and Updates', () => {
            const getLastUserHasType = () => {
                /**
                 * retrieve the last added action
                 */
                return UserHasTypeProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(userHasTypes => {
                    const lastUserHasType = userHasTypes[0]
                    assert.isDefined(lastUserHasType)
                    return lastUserHasType
                })
            }

            /**
             * We check that all SELECT and UPDATE operations work
             */

            it('getById(-1) should return NULL', () => {
                return UserHasTypeProxy.getById(-1).then((userHasType) => {
                    assert.isNull(userHasType)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an user "${ROLE_NAME}"`, () => {
                return getLastUserHasType().then(lastUserHasType => {
                    return UserHasTypeProxy.getById(lastUserHasType.id).then(userHasType => {
                        if (userHasType) {
                            assert.equal(userHasType.userId, lastUserHasType.userId)
                            assert.equal(userHasType.userTypeId, lastUserHasType.userTypeId)
                        }
                    }).catch(err => {
                        throw err
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return UserHasTypeProxy.getAll({}).then((userHasTypes) => {
                    assert.isArray(userHasTypes)
                    userHasTypes.forEach(userHasType => {
                        assert.isDefined(userHasType)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(userHasType) should work', () => {
                return getLastUserHasType().then(lastRole => {
                    return UserHasTypeProxy.update({
                        id: lastRole.id,
                        name: `${ROLE_NAME}`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.fail()
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(userHasType)')
                })
            })

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastUserHasType().then(lastRole => {
                        return UserHasTypeProxy.destroy(lastRole.id).then((success) => {
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

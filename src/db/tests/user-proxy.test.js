import db, { User } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserProxy, Events } = GetProxy({ User })

const USER_EMAIL = 'abc@mailinator.com'
const USER_PASSWORD = 'password'
const USER_PASSWORD2 = 'password2'
const USER_GENDER = 'male'

const { isDataProxy } = require('./helpers')

describe('UserProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        return isDataProxy(UserProxy)
    })

    describe('Inserts', () => {
        /**
         * We check that all INSERT constraints are obeyed
         */
        it('insert(user) should work', () => {
            return UserProxy.insert({
                email: USER_EMAIL,
                pwd: USER_PASSWORD,
                gender: USER_GENDER
            }).then(user => {
                assert.isNotNull(user)
            }).catch(err => {
                assert.fail()
            })
        })

        describe('Selects and Updates', () => {
            const getLastUser = () => {
                /**
                 * retrieve the last added action
                 */
                return UserProxy.getAll({
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
                return UserProxy.getById(-1).then((user) => {
                    assert.isNull(user)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an user "${USER_EMAIL}"`, () => {
                return getLastUser().then(lastUser => {
                    return UserProxy.getById(lastUser.id).then(savedUser => {
                        if (savedUser) {
                            assert.equal(savedUser.email, USER_EMAIL)
                        }
                    }).catch(err => {
                        assert.isNull(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return UserProxy.getAll({}).then((users) => {
                    assert.isArray(users)
                    users.forEach(user => {
                        assert.isDefined(user)
                        assert.isDefined(user.email)
                        assert.isDefined(user.gender)
                        assert.isDefined(user.pwd)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(action) should work', () => {
                return getLastUser().then(lastUser => {
                    return UserProxy.update({
                        id: lastUser.id,
                        pwd: `${USER_PASSWORD2}`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.fail()
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
                    return getLastUser().then(lastUser => {
                        return UserProxy.destroy(lastUser.id).then((success) => {
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

import db, { PhoneNumber, User } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserProxy, PhoneProxy, Events } = GetProxy({ PhoneNumber, User })

const PHONE_NO = '08012345678'
const USER_EMAIL = 'abc@mailinator.com'
const USER_PASSWORD = 'password'
const USER_GENDER = 'male'

const { isDataProxy } = require('./helpers')

describe('PhoneProxy', () => {

    it('should be a valid Data Proxy', () => {
        /**
         * ensure that the data-proxy contains all valid functions
         */
        return isDataProxy(PhoneProxy)
    })

    describe('Create Phone Number', () => {
        let createdUser = null
        
        before(() => {
            /**
             * create the user that has the phone-number
             */
            return UserProxy.insert({
                email: USER_EMAIL,
                pwd: USER_PASSWORD,
                gender: USER_GENDER
            })
            .then(user => {
                createdUser = user
            })
            .catch(err => {
                console.log(err)
            })
        })
    
        after(() => {
            /**
             * delete the user that was created before all tests
             */
            return UserProxy.destroy(createdUser.id).then(success => {
    
            }).catch(err => {
                console.error(err)
            })
        })

        it('insert(phone) without userId should throw NullParamError', () => {
            /**
             * if an INSERT is attempted without a userId, a NullParamError should be thrown
             */
            return PhoneProxy.insert({
                phone: PHONE_NO
            }).then(phone => {
                assert.isNotNull(phone)
                assert.isNotNull(phone.dataValues)
            }).catch(err => {
                assert.equal(err.name, 'NullParamError')
            })
        })
        
        it('insert(phone) with a userId that does not exist should throw UserNotExistsError', () => {
            /**
             * if an INSERT is attempted with a userId that does not exist, a UserNotExistsError should be thrown
             */
            return PhoneProxy.insert({
                phone: PHONE_NO,
                userId: -1
            }).then(phone => {
                assert.isNotNull(phone)
            }).catch(err => {
                assert.equal(err.name, 'UserNotExistsError')
            })
        })
        
        it('insert(phone) should work', () => {
            /**
             * an INSERT should be successful if it has the right params
             */
            return PhoneProxy.insert({
                phone: PHONE_NO,
                userId: createdUser.id
            }).then(phone => {
                assert.isNotNull(phone)
            }).catch(err => {
                assert.fail(err)
            })
        })

        describe('Others', () => {
            const getLastPhoneNumber = () => {
                /**
                 * retrieve the last added phone number
                 */
                return PhoneProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(phones => {
                    const lastPhone = phones[0]
                    assert.isDefined(lastPhone)
                    return lastPhone
                })
            }

            it('getById(-1) should return NULL', () => {
                return PhoneProxy.getById(-1).then((phone) => {
                    assert.isNull(phone)
                }).catch(err => {
                    assert.fail(err)
                })
            })
            
            it(`getById(id) should return an phone "${PHONE_NO}"`, () => {
                return getLastPhoneNumber().then(lastPhone => {
                    return PhoneProxy.getById(lastPhone.id).then(savedPhone => {
                        if (savedPhone) {
                            assert.equal(savedPhone.phone, PHONE_NO)
                        }
                    }).catch(err => {
                        assert.fail(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return PhoneProxy.getAll({}).then((phones) => {
                    assert.isArray(phones)
                    phones.forEach(phone => {
                        assert.isDefined(phone)
                        assert.isDefined(!!phone.id)
                        assert.isDefined(!!phone.name)
                    })
                }).catch(err => {
                    assert.fail(err)
                })
            })
            
            it('update(phone) should work', () => {
                return getLastPhoneNumber().then(lastPhone => {
                    return PhoneProxy.update({
                        id: lastPhone.id,
                        name: `${PHONE_NO}-modified`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.equal(err.name, 'SequelizeUniqueConstraintError')
                    })
                }).catch(err => {
                    assert.fail(err)
                })
            })
            
            it(`destroy(id) should return a boolean`, () => {
                return getLastPhoneNumber().then(lastPhone => {
                    assert.isDefined(lastPhone, 'lastPhone should be defined')
                    return PhoneProxy.destroy(lastPhone.id).then((success) => {
                        assert.equal(success, 1)
                    }).catch(err => {
                        assert.fail(err)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
        })
    })
})

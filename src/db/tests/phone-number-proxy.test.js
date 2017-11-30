import db, { PhoneNumber, User } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserProxy, PhoneProxy, Events } = GetProxy({ PhoneNumber, User })

const PHONE_NO = '08012345678'
const USER_EMAIL = 'abc@mailinator.com'
const USER_PASSWORD = 'password'
const USER_GENDER = 'male'

const isDataProxy = (proxy = PhoneProxy) => {
    assert.isNotNull(proxy)
    assert.isFunction(proxy.destroy)
    assert.isFunction(proxy.getAll)
    assert.isFunction(proxy.getById)
    assert.isFunction(proxy.getSingle)
    assert.isFunction(proxy.insert)
    assert.isFunction(proxy.update)
    assert.isFunction(proxy.exists)
}

describe('PhoneProxy', () => {

    it('should be a valid Data Proxy', () => {
        return isDataProxy(PhoneProxy)
    })

    describe('Create Phone Number', () => {
        let createdUser = null
        
        before(() => {
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
            return UserProxy.destroy(createdUser.id).then(success => {
    
            }).catch(err => {
                console.error(err)
            })
        })

        it('insert(phone) without userId should throw NullParamError', () => {
            return PhoneProxy.insert({
                phone: PHONE_NO
            }).then(phone => {
                assert.isNotNull(phone)
                assert.isNotNull(phone.dataValues)
            }).catch(err => {
                assert.equal(err.name, 'NullParamError')
            })
        })
        
        it('insert(phone) should work', () => {
            return PhoneProxy.insert({
                phone: PHONE_NO,
                userId: createdUser.id
            }).then(phone => {
                assert.isNotNull(phone)
                assert.isNotNull(phone.dataValues)
            }).catch(err => {
                console.error(err)
            })
        })

        describe('Others', () => {
            const getLastPhoneNumber = () => {
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
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an phone "${PHONE_NO}"`, () => {
                return getLastPhoneNumber().then(lastPhone => {
                    PhoneProxy.getById(lastPhone.id).then(savedPhone => {
                        if (savedPhone) {
                            assert.equal(savedPhone.name, PHONE_NO)
                        }
                    }).catch(err => {
                        assert.isNull(err)
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
                    assert.isNull(err)
                })
            })
            
            it('update(phone) should work', () => {
                return getLastPhoneNumber().then(lastPhone => {
                    PhoneProxy.update({
                        id: lastPhone.id,
                        name: `${PHONE_NO}-modified`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.equal(err.name, 'SequelizeUniqueConstraintError')
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(phone)')
                })
            })
            
            it(`destroy(id) should return a boolean`, () => {
                return getLastPhoneNumber().then(lastPhone => {
                    assert.isDefined(lastPhone, 'lastPhone should be defined')
                    PhoneProxy.destroy(lastPhone.id).then((phone) => {
                        assert.isTrue(phone)
                    }).catch(err => {
                        assert.isNull(err)
                    })
                }).catch(err => {
                    assert.isNull(err, 'there should be no error during delete')
                })
            })
        })
    })
})

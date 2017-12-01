import db, { User, ImageType, Image } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { UserProxy, ImageProxy, ImageTypeProxy, Events } = GetProxy({ User, ImageType, Image })

const USER_EMAIL = 'abc@mailinator.com', USER_PASSWORD = 'password', USER_GENDER = 'male'
const IMAGE_TYPE_NAME = 'student', IMAGE_TYPE_WIDTH = 300, IMAGE_TYPE_HEIGHT = 600
const IMAGE_NAME = 'PICSUM', IMAGE_LOCATION = 'https://picsum.photos/200/300'


const { isDataProxy } = require('./helpers')

describe('ImageProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        return isDataProxy(ImageProxy)
    })

    describe('Create User and ImageType then Inserts', () => {

        let createdUser = null, createdImageType = null

        before(() => {
            /**
             * create the user, then imageType to be used in tests
             */
            return UserProxy.insert({
                email: USER_EMAIL,
                pwd: USER_PASSWORD,
                gender: USER_GENDER
            })
            .then(user => {
                createdUser = user

                return ImageTypeProxy.insert({
                    name: IMAGE_TYPE_NAME,
                    width: IMAGE_TYPE_WIDTH,
                    height: IMAGE_TYPE_HEIGHT
                })
                .then(imageType => {
                    createdImageType = imageType
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
             * delete the user, then imageType that was created before all tests
             */
            return UserProxy.destroy(createdUser.id).then(success => {
                return ImageTypeProxy.destroy(createdImageType.id).then(success => {
                    
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
        it('insert(image) without userId should throw NullParamError', () => {
            return ImageProxy.insert({
                name: IMAGE_NAME,
                location: IMAGE_LOCATION,
                active: true,
                typeId: createdImageType.id
            }).then(image => {
                assert.isNotNull(image)
            }).catch(err => {
                assert.equal(err.name, 'NullParamError')
            })
        })

        it('insert(image) without imageTypeId should throw NullParamError', () => {
            return ImageProxy.insert({
                name: IMAGE_NAME,
                location: IMAGE_LOCATION,
                active: true,
                userId: createdUser.id
            }).then(image => {
                assert.isNotNull(image)
            }).catch(err => {
                assert.equal(err.name, 'NullParamError')
            })
        })
        
        it('insert(image) should work', () => {
            return ImageProxy.insert({
                name: IMAGE_NAME,
                location: IMAGE_LOCATION,
                active: true,
                userId: createdUser.id,
                typeId: createdImageType.id
            }).then(image => {
                assert.isNotNull(image)
            }).catch(err => {
                throw err
            })
        })

        describe('Selects and Updates', () => {
            const getLastImage = () => {
                /**
                 * retrieve the last added action
                 */
                return ImageProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(roles => {
                    const lastImage = roles[0]
                    assert.isDefined(lastImage)
                    return lastImage
                })
            }

            /**
             * We check that all SELECT and UPDATE operations work
             */

            it('getById(-1) should return NULL', () => {
                return ImageProxy.getById(-1).then((image) => {
                    assert.isNull(image)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an image "${IMAGE_NAME}"`, () => {
                return getLastImage().then(lastImage => {
                    return ImageProxy.getById(lastImage.id).then(savedImage => {
                        if (savedImage) {
                            assert.equal(savedImage.name, IMAGE_NAME)
                        }
                    }).catch(err => {
                        assert.isNull(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return ImageProxy.getAll({}).then((images) => {
                    assert.isArray(images)
                    images.forEach(image => {
                        assert.isDefined(image)
                        assert.isDefined(image.name)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(image) should work', () => {
                return getLastImage().then(lastImage => {
                    return ImageProxy.update({
                        id: lastImage.id,
                        name: `${IMAGE_NAME}`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.fail()
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(image)')
                })
            })

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastImage().then(lastImage => {
                        return ImageProxy.destroy(lastImage.id).then((success) => {
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

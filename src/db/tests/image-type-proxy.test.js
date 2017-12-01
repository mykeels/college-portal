import db, { ImageType } from '../'
import GetProxy from '../proxies'

const { assert } = require('chai')
const { ImageTypeProxy, Events } = GetProxy({ ImageType })

const IMAGE_TYPE_NAME = 'student', IMAGE_TYPE_WIDTH = 300, IMAGE_TYPE_HEIGHT = 600

const { isDataProxy } = require('./helpers')

describe('ImageTypeProxy', () => {
    
    it('should be a valid Data Proxy', () => {
        /**
         * First, we check that the proxy object provided has all proxy functions
         */
        return isDataProxy(ImageTypeProxy)
    })

    describe('Inserts', () => {
        /**
         * We check that all INSERT constraints are obeyed
         */
        it('insert(imageType) should work', () => {
            return ImageTypeProxy.insert({
                name: IMAGE_TYPE_NAME,
                width: IMAGE_TYPE_WIDTH,
                height: IMAGE_TYPE_HEIGHT
            }).then(imageType => {
                assert.isNotNull(imageType)
            }).catch(err => {
                throw err
            })
        })

        describe('Selects and Updates', () => {
            const getLastImageType = () => {
                /**
                 * retrieve the last added action
                 */
                return ImageTypeProxy.getAll({
                    limit: 1,
                    order: [ [ 'createdAt', 'DESC' ]]
                }).then(imageTypes => {
                    const lastImageType = imageTypes[0]
                    assert.isDefined(lastImageType)
                    return lastImageType
                })
            }

            /**
             * We check that all SELECT and UPDATE operations work
             */

            it('getById(-1) should return NULL', () => {
                return ImageTypeProxy.getById(-1).then((imageType) => {
                    assert.isNull(imageType)
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it(`getById(id) should return an imageType "${IMAGE_TYPE_NAME}"`, () => {
                return getLastImageType().then(lastImageType => {
                    return ImageTypeProxy.getById(lastImageType.id).then(savedImageType => {
                        if (savedImageType) {
                            assert.equal(savedImageType.name, IMAGE_TYPE_NAME)
                        }
                    }).catch(err => {
                        assert.isNull(err)
                    })
                })
            })
            
            it('getAll() should return items', () => {
                return ImageTypeProxy.getAll({}).then((imageTypes) => {
                    assert.isArray(imageTypes)
                    imageTypes.forEach(imageType => {
                        assert.isDefined(imageType)
                        assert.isDefined(imageType.name)
                    })
                }).catch(err => {
                    assert.isNull(err)
                })
            })
            
            it('update(imageType) should work', () => {
                return getLastImageType().then(lastImageType => {
                    return ImageTypeProxy.update({
                        id: lastImageType.id,
                        name: `${IMAGE_TYPE_NAME}-modified`
                    }).then(rows => {
                        assert.isArray(rows)
                    }).catch(err => {
                        assert.fail()
                    })
                }).catch(err => {
                    assert.isNull(err, 'update(imageType)')
                })
            })

            describe('Deletes', () => {
                /**
                 * Last, we delete the items created
                 */
                it(`destroy(id) should return a boolean`, () => {
                    return getLastImageType().then(lastImageType => {
                        return ImageTypeProxy.destroy(lastImageType.id).then((success) => {
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

import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import createError from '../helpers/errors'
import 'babel-polyfill'

export default (UserProxy, ImageTypeProxy, Image, Event) => {
    const raiseEvent = (name, ...args) => {
        Event.emit(name, ...args)   
    }

    const UserNotExistsError = createError('UserNotExistsError')
    const ImageTypeNotExistsError = createError('ImageTypeNotExistsError')
    const NullParamError = createError('NullParamError')
    
    const confirmUserExists = (userId) => {
        return new Promise((resolve, reject) => {
            UserProxy.exists(userId).then(userExists => {
                if (!userExists) throw new UserNotExistsError()
                else resolve(userExists)
            }).catch(err => {
                reject(err)
            })
        })
    }
    
    const confirmImageTypeExists = (imageTypeId) => {
        return new Promise((resolve, reject) => {
            ImageTypeProxy.exists(imageTypeId).then(imageTypeExists => {
                if (!imageTypeExists) throw new ImageTypeNotExistsError()
                else resolve(imageTypeExists)
            }).catch(err => {
                reject(err)
            })
        })
    }

    if (!Image) throw new Error('Image parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')

    return {
        /**
         * retrieves all items from the db matching the filter
         * @param {*} filter sequelize filter options
         */
        async getAll(filter = {}) {
            const images = await Image.findAll(filter)
            return images.map(image => image.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const images = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (images ? images.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const image = await Image.findById(id, {})
            return image ? image.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const image = await Image.findById(id, {})
            return image && image.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            if (data.userId && data.typeId) {
                return Promise.all([confirmUserExists(data.userId), confirmImageTypeExists(data.typeId)]).then(async (exists) => {
                    const [err, image] = await catchErrors(Image.create(data, options))
                    if (err) {
                        raiseEvent(Events.INSERT_ERROR, err)
                        throw err
                    }
                    else {
                        raiseEvent(Events.INSERT_SUCCESSFUL, image ? image.dataValues : null)
                    }
                    return image ? image.dataValues : null
                }).catch(err => {
                    raiseEvent(Events.INSERT_ERROR, err)
                    throw err
                })
            }
            else {
                const err = new NullParamError(!data.userId ? 'data.userId' : 'data.typeId')
                raiseEvent(Events.INSERT_ERROR, err)
                throw err
            }
        },
        /**
         * updates a single item in the db
         * @param {Object} data the information to be inserted
         * @param {Number} data.id - the identifier for the data you wish to update
         * @param {*} options additional sequelize options/constraints
         */
        async update(data, options = {}) {
            const preUpdateFn = (data) => {
                const ret = [Promise.resolve(true)]
                if (data.userId) ret.push(confirmUserExists(data.userId))
                if (data.typeId) ret.push(confirmImageTypeExists(data.typeId))
                return Promise.all(ret)
            }
            return preUpdateFn(data).then(async (exists) => {
                const [err, affectedRows] = await catchErrors(Image.update(data, {...options, ...{
                    where: {
                        id: data.id
                    }
                }}))
                if (err) {
                    raiseEvent(Events.UPDATE_ERROR, err)
                    throw err
                }
                else {
                    raiseEvent(Events.UPDATE_SUCCESSFUL, affectedRows)
                }
                return affectedRows
            }).catch(err => {
                raiseEvent(Events.UPDATE_ERROR, err)
                throw err
            })
        },
        /**
         * deletes an item / some items in the db
         * @param {Number} id the identifier of the item to be deleted
         */
        async destroy(id) {
            const [err, success] = await catchErrors(Image.destroy({
                where: {
                    id: id
                }
            }))
            if (err) {
                raiseEvent(Events.DELETE_ERROR, err)
                throw err
            }
            else {
                raiseEvent(Events.DELETE_SUCCESSFUL, success)
            }
            return success
        }
    }
}

export const Events = {
    INSERT_SUCCESSFUL: 'db:image:insert:success',
    INSERT_ERROR: 'db:image:insert:error',
    UPDATE_SUCCESSFUL: 'db:image:update:success',
    UPDATE_ERROR: 'db:image:update:error',
    DELETE_SUCCESSFUL: 'db:image:delete:success',
    DELETE_ERROR: 'db:image:delete:error'
}
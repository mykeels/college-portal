import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import createError from '../helpers/errors'
import 'babel-polyfill'

export default (UserProxy, UserTypeProxy, UserHasType, Event) => {
    const raiseEvent = (name, ...args) => {
        Event.emit(name, ...args)   
    }

    if (!UserHasType) throw new Error('UserHasType parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')
    
    const UserNotExistsError = createError('UserNotExistsError')
    const UserTypeNotExistsError = createError('UserTypeNotExistsError')
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
    
    const confirmUserTypeExists = (userTypeId) => {
        return new Promise((resolve, reject) => {
            UserTypeProxy.exists(userTypeId).then(userTypeExists => {
                if (!userTypeExists) throw new UserTypeNotExistsError()
                else resolve(userTypeExists)
            }).catch(err => {
                reject(err)
            })
        })
    }

    return {
        /**
         * retrieves all items from the db matching the filter
         * @param {*} filter sequelize filter options
         */
        async getAll(filter = {}) {
            const userHasTypes = await UserHasType.findAll(filter)
            return userHasTypes.map(userHasType => userHasType.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const userHasTypes = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (userHasTypes ? userHasTypes.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const userHasType = await UserHasType.findById(id, {})
            return userHasType ? userHasType.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const userHasType = await UserHasType.findById(id, {})
            return userHasType && userHasType.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         * @throws {NullParamError, UserNotExistsError, UserTypeNotExistsError}
         */
        async insert(data, options = {}) {
            if (data.userId && data.userTypeId) {
                return Promise.all([confirmUserExists(data.userId), confirmUserTypeExists(data.userTypeId)]).then(async (exists) => {
                    const [err, userHasType] = await catchErrors(UserHasType.create(data, options))
                    if (err) {
                        raiseEvent(Events.INSERT_ERROR, err)
                        throw err
                    }
                    else {
                        raiseEvent(Events.INSERT_SUCCESSFUL, userHasType ? userHasType.dataValues : null)
                    }
                    return userHasType ? userHasType.dataValues : null
                }).catch(err => {
                    raiseEvent(Events.INSERT_ERROR, err)
                    throw err
                })
            }
            else {
                const err = new NullParamError(!data.userId ? 'data.userId' : 'data.userTypeId')
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
                if (data.userTypeId) ret.push(confirmUserTypeExists(data.userTypeId))
                return Promise.all(ret)
            }
            return preUpdateFn(data).then(async (exists) => {
                const [err, affectedRows] = await catchErrors(UserHasType.update(data, {...options, ...{
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
            const [err, success] = await catchErrors(UserHasType.destroy({
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
    INSERT_SUCCESSFUL: 'db:user-has-type:insert:success',
    INSERT_ERROR: 'db:user-has-type:insert:error',
    UPDATE_SUCCESSFUL: 'db:user-has-type:update:success',
    UPDATE_ERROR: 'db:user-has-type:update:error',
    DELETE_SUCCESSFUL: 'db:user-has-type:delete:success',
    DELETE_ERROR: 'db:user-has-type:delete:error'
}
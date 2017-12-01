import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import 'babel-polyfill'

export default (UserTypeProxy, Role, Event) => {
    const raiseEvent = (name, ...args) => {
        Event.emit(name, ...args)   
    }

    if (!Role) throw new Error('Role parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')
    
    const UserTypeNotExistsError = createError('UserTypeNotExistsError')
    const ImageTypeNotExistsError = createError('ImageTypeNotExistsError')
    const NullParamError = createError('NullParamError')
    
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
            const roles = await Role.findAll(filter)
            return roles.map(role => role.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const roles = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (roles ? roles.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const role = await Role.findById(id, {})
            return role ? role.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const role = await Role.findById(id, {})
            return role && role.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            if (data.userTypeId) {
                return confirmUserTypeExists(data.userTypeId).then(async (exists) => {
                    const [err, role] = await catchErrors(Role.create(data, options))
                    if (err) {
                        raiseEvent(Events.INSERT_ERROR, err)
                        throw err
                    }
                    else {
                        raiseEvent(Events.INSERT_SUCCESSFUL, role ? role.dataValues : null)
                    }
                    return role ? role.dataValues : null
                }).catch(err => {
                    raiseEvent(Events.INSERT_ERROR, err)
                    throw err
                })
            }
            else {
                const err = new NullParamError('data.userTypeId')
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
            const preUpdateFn = (data) => data.userTypeId ? confirmUserTypeExists(data.userTypeId) : (Promise.resolve(true))
            return preUpdateFn(data).then(async (exists) => {
                const [err, affectedRows] = await catchErrors(Role.update(data, {...options, ...{
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
            const [err, success] = await catchErrors(Role.destroy({
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
    INSERT_SUCCESSFUL: 'db:role:insert:success',
    INSERT_ERROR: 'db:role:insert:error',
    UPDATE_SUCCESSFUL: 'db:role:update:success',
    UPDATE_ERROR: 'db:role:update:error',
    DELETE_SUCCESSFUL: 'db:role:delete:success',
    DELETE_ERROR: 'db:role:delete:error'
}
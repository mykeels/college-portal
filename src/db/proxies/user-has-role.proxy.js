import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import createError from '../helpers/errors'
import 'babel-polyfill'

export default (UserProxy, RoleProxy, UserHasRole, Event) => {
    const raiseEvent = (name, ...args) => {
        Event.emit(name, ...args)   
    }

    if (!UserHasRole) throw new Error('UserHasRole parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')

    const UserNotExistsError = createError('UserNotExistsError')
    const RoleNotExistsError = createError('RoleNotExistsError')
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

    const confirmRoleExists = (roleId) => {
        return new Promise((resolve, reject) => {
            RoleProxy.exists(roleId).then(roleExists => {
                if (!roleExists) throw new RoleNotExistsError()
                else resolve(roleExists)
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
            const userHasRoles = await UserHasRole.findAll(filter)
            return userHasRoles.map(userHasRole => userHasRole.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const userHasRoles = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (userHasRoles ? userHasRoles.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const userHasRole = await UserHasRole.findById(id, {})
            return userHasRole ? userHasRole.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const userHasRole = await UserHasRole.findById(id, {})
            return userHasRole && userHasRole.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            if (data.userId && data.roleId) {
                return Promise.all([confirmUserExists(data.userId), confirmRoleExists(data.roleId)]).then(async (exists) => {
                    const [err, userHasRole] = await catchErrors(UserHasRole.create(data, options))
                    if (err) {
                        raiseEvent(Events.INSERT_ERROR, err)
                        throw err
                    }
                    else {
                        raiseEvent(Events.INSERT_SUCCESSFUL, userHasRole ? userHasRole.dataValues : null)
                    }
                    return userHasRole ? userHasRole.dataValues : null
                }).catch(err => {
                    raiseEvent(Events.INSERT_ERROR, err)
                    throw err
                })
            }
            else {
                const err = new NullParamError(!data.roleId ? 'data.roleId' : 'data.userId')
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
                if (data.roleId) ret.push(confirmRoleExists(data.roleId))
                if (data.userId) ret.push(confirmUserExists(data.userId))
                return Promise.all(ret)
            }
            return preUpdateFn(data).then(async (exists) => {
                const [err, affectedRows] = await catchErrors(UserHasRole.update(data, {...options, ...{
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
            const [err, success] = await catchErrors(UserHasRole.destroy({
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
    INSERT_SUCCESSFUL: 'db:user-has-role:insert:success',
    INSERT_ERROR: 'db:user-has-role:insert:error',
    UPDATE_SUCCESSFUL: 'db:user-has-role:update:success',
    UPDATE_ERROR: 'db:user-has-role:update:error',
    DELETE_SUCCESSFUL: 'db:user-has-role:delete:success',
    DELETE_ERROR: 'db:user-has-role:delete:error'
}
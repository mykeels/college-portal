import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import createError from '../helpers/errors'
import 'babel-polyfill'

export default (RoleProxy, ActionProxy, RolePerformsAction, Event) => {
    const raiseEvent = (name, ...args) => {
        Event.emit(name, ...args)   
    }

    if (!RolePerformsAction) throw new Error('RolePerformsAction parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')


    const RoleNotExistsError = createError('RoleNotExistsError')
    const ActionNotExistsError = createError('ActionNotExistsError')
    const NullParamError = createError('NullParamError')

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
    
    const confirmActionExists = (actionId) => {
        return new Promise((resolve, reject) => {
            ActionProxy.exists(actionId).then(actionExists => {
                if (!actionExists) throw new ActionNotExistsError()
                else resolve(actionExists)
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
            const rolePerformsActions = await RolePerformsAction.findAll(filter)
            return rolePerformsActions.map(rolePerformsAction => rolePerformsAction.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const rolePerformsActions = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (rolePerformsActions ? rolePerformsActions.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const rolePerformsAction = await RolePerformsAction.findById(id, {})
            return rolePerformsAction ? rolePerformsAction.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const rolePerformsAction = await RolePerformsAction.findById(id, {})
            return rolePerformsAction && rolePerformsAction.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            if (data.roleId && data.actionId) {
                return Promise.all([confirmRoleExists(data.roleId), confirmActionExists(data.actionId)]).then(async (exists) => {
                    const [err, rolePerformsAction] = await catchErrors(RolePerformsAction.create(data, options))
                    if (err) {
                        raiseEvent(Events.INSERT_ERROR, err)
                        throw err
                    }
                    else {
                        raiseEvent(Events.INSERT_SUCCESSFUL, rolePerformsAction ? rolePerformsAction.dataValues : null)
                    }
                    return rolePerformsAction ? rolePerformsAction.dataValues : null
                }).catch(err => {
                    raiseEvent(Events.INSERT_ERROR, err)
                    throw err
                })
            }
            else {
                const err = new NullParamError(!data.roleId ? 'data.roleId' : 'data.actionId')
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
                if (data.actionId) ret.push(confirmActionExists(data.actionId))
                return Promise.all(ret)
            }
            return preUpdateFn(data).then(async (exists) => {
                const [err, affectedRows] = await catchErrors(RolePerformsAction.update(data, {...options, ...{
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
            const [err, success] = await catchErrors(RolePerformsAction.destroy({
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
    INSERT_SUCCESSFUL: 'db:role-performs-action:insert:success',
    INSERT_ERROR: 'db:role-performs-action:insert:error',
    UPDATE_SUCCESSFUL: 'db:role-performs-action:update:success',
    UPDATE_ERROR: 'db:role-performs-action:update:error',
    DELETE_SUCCESSFUL: 'db:role-performs-action:delete:success',
    DELETE_ERROR: 'db:role-performs-action:delete:error'
}
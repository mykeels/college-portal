import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import 'babel-polyfill'

export default (UserType, Event) => {
    const raiseEvent = (name, ...args) => {
        Event.emit(name, ...args)   
    }

    if (!UserType) throw new Error('UserType parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')

    return {
        /**
         * retrieves all items from the db matching the filter
         * @param {*} filter sequelize filter options
         */
        async getAll(filter = {}) {
            const userTypes = await UserType.findAll(filter)
            return userTypes.map(userType => userType.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const userTypes = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (userTypes ? userTypes.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const userType = await UserType.findById(id, {})
            return userType ? userType.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const userType = await UserType.findById(id, {})
            return userType && userType.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            const [err, userType] = await catchErrors(UserType.create(data, options))
            if (err) {
                raiseEvent(Events.INSERT_ERROR, err)
                throw err
            }
            else {
                raiseEvent(Events.INSERT_SUCCESSFUL, userType ? userType.dataValues : null)
            }
            return userType ? userType.dataValues : null
        },
        /**
         * updates a single item in the db
         * @param {Object} data the information to be inserted
         * @param {Number} data.id - the identifier for the data you wish to update
         * @param {*} options additional sequelize options/constraints
         */
        async update(data, options = {}) {
            const [err, affectedRows] = await catchErrors(UserType.update(data, {...options, ...{
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
        },
        /**
         * deletes an item / some items in the db
         * @param {Number} id the identifier of the item to be deleted
         */
        async destroy(id) {
            const [err, success] = await catchErrors(UserType.destroy({
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
    INSERT_SUCCESSFUL: 'db:user-type:insert:success',
    INSERT_ERROR: 'db:user-type:insert:error',
    UPDATE_SUCCESSFUL: 'db:user-type:update:success',
    UPDATE_ERROR: 'db:user-type:update:error',
    DELETE_SUCCESSFUL: 'db:user-type:delete:success',
    DELETE_ERROR: 'db:user-type:delete:error'
}
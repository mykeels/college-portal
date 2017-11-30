import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import 'babel-polyfill'

export default (Action, Event) => {
    const raiseEvent = (name, ...args) => {
        // console.log('raise-event:', name, 
        //         (args.filter(arg => arg instanceof Error)[0] || {}).name || 
        //         (args.filter(arg => ((arg || {}).constructor || {}).name === 'Number')[0]) ||
        //         args.map(arg => ((arg || {}).constructor || {}).name).join(' '))
        Event.emit(name, ...args)   
    }

    if (!Action) throw new Error('Action parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')

    return {
        /**
         * retrieves all items from the db matching the filter
         * @param {*} filter sequelize filter options
         */
        async getAll(filter = {}) {
            const actions = await Action.findAll(filter)
            return actions.map(action => action.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const actions = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (actions ? actions.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const action = await Action.findById(id, {})
            return action ? action.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const action = await Action.findById(id, {})
            return action && action.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            const [err, action] = await catchErrors(Action.create(data, options))
            if (err) {
                raiseEvent(Events.INSERT_ERROR, err)
                throw err
            }
            else {
                raiseEvent(Events.INSERT_SUCCESSFUL, action ? action.dataValues : null)
            }
            return action ? action.dataValues : null
        },
        /**
         * updates a single item in the db
         * @param {Object} data the information to be inserted
         * @param {Number} data.id - the identifier for the data you wish to update
         * @param {*} options additional sequelize options/constraints
         */
        async update(data, options = {}) {
            const [err, affectedRows] = await catchErrors(Action.update(data, {...options, ...{
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
            const [err, success] = await catchErrors(Action.destroy({
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
    INSERT_SUCCESSFUL: 'db:action:insert:success',
    INSERT_ERROR: 'db:action:insert:error',
    UPDATE_SUCCESSFUL: 'db:action:update:success',
    UPDATE_ERROR: 'db:action:update:error',
    DELETE_SUCCESSFUL: 'db:action:delete:success',
    DELETE_ERROR: 'db:action:delete:error'
}
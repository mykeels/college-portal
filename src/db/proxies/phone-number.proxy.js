import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import createError from '../helpers/errors'
import 'babel-polyfill'

export default (UserProxy, PhoneModel, Event) => {
    const raiseEvent = (name, ...args) => {
        // console.log('raise-event:', name, 
        //         (args.filter(arg => arg instanceof Error)[0] || {}).name || 
        //         (args.filter(arg => ((arg || {}).constructor || {}).name === 'Number')[0]) ||
        //         args.map(arg => ((arg || {}).constructor || {}).name).join(' '))
        Event.emit(name, ...args)   
    }

    if (!PhoneModel) throw new Error('PhoneModel parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')

    const UserNotExistsError = createError('UserNotExistsError')
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

    return {
        /**
         * retrieves all items from the db matching the filter
         * @param {*} filter sequelize filter options
         */
        async getAll(filter = {}) {
            const phones = await PhoneModel.findAll(filter)
            return phones.map(phone => phone.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const phones = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (phones ? phones.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const phone = await PhoneModel.findById(id, {})
            return phone ? phone.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const phone = await PhoneModel.findById(id, {})
            return phone && phone.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            if (data.userId) {
                confirmUserExists(data.userId).then(async (exists) => {
                    const [err, phone] = await catchErrors(PhoneModel.create(data, options))
                    if (err) {
                        raiseEvent(Events.INSERT_ERROR, err)
                        throw err
                    }
                    else {
                        raiseEvent(Events.INSERT_SUCCESSFUL, phone ? phone.dataValues : null)
                    }
                    return phone ? phone.dataValues : null
                }).catch(err => {
                    raiseEvent(Events.INSERT_ERROR, err)
                    throw err
                })
            }
            else {
                const err = new NullParamError('data.userId')
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
            const [err, affectedRows] = await catchErrors(PhoneModel.update(data, {...options, ...{
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
            const [err, success] = await catchErrors(PhoneModel.destroy({
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
    INSERT_SUCCESSFUL: 'db:phone:insert:success',
    INSERT_ERROR: 'db:phone:insert:error',
    UPDATE_SUCCESSFUL: 'db:phone:update:success',
    UPDATE_ERROR: 'db:phone:update:error',
    DELETE_SUCCESSFUL: 'db:phone:delete:success',
    DELETE_ERROR: 'db:phone:delete:error'
}
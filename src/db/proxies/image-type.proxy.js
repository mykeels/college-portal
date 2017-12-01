import Sequelize from 'sequelize'
import catchErrors from '../helpers/catch-errors'
import 'babel-polyfill'

export default (ImageType, Event) => {
    const raiseEvent = (name, ...args) => {
        Event.emit(name, ...args)   
    }

    if (!ImageType) throw new Error('ImageType parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')

    return {
        /**
         * retrieves all items from the db matching the filter
         * @param {*} filter sequelize filter options
         */
        async getAll(filter = {}) {
            const imageTypes = await ImageType.findAll(filter)
            return imageTypes.map(imageType => imageType.dataValues)
        },
        /**
         * retrieves one item from the db if its data matches the filter specified
         * @param {*} filter 
         */
        async getSingle(filter = {}) {
            const imageTypes = await this.getAll({ ...filter, ...{ limit: 1 } })
            return (imageTypes ? imageTypes.dataValues : [])[0]
        },
        /**
         * retrieves one item from the db if its id matches the id specified
         * @param {Number} id the identifier
         */
        async getById(id) {
            const imageType = await ImageType.findById(id, {})
            return imageType ? imageType.dataValues : null
        },
        /**
         * returns true or false indicating whether or not an item exists in the db with a specified id
         * @param {Number} id the identifier
         */
        async exists(id) {
            const imageType = await ImageType.findById(id, {})
            return imageType && imageType.dataValues ? true : false
        },
        /**
         * inserts a single item to the db
         * @param {*} data the information to be inserted
         * @param {*} options sequelize insert options/constraints
         */
        async insert(data, options = {}) {
            const [err, imageType] = await catchErrors(ImageType.create(data, options))
            if (err) {
                raiseEvent(Events.INSERT_ERROR, err)
                throw err
            }
            else {
                raiseEvent(Events.INSERT_SUCCESSFUL, imageType ? imageType.dataValues : null)
            }
            return imageType ? imageType.dataValues : null
        },
        /**
         * updates a single item in the db
         * @param {Object} data the information to be inserted
         * @param {Number} data.id - the identifier for the data you wish to update
         * @param {*} options additional sequelize options/constraints
         */
        async update(data, options = {}) {
            const [err, affectedRows] = await catchErrors(ImageType.update(data, {...options, ...{
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
            const [err, success] = await catchErrors(ImageType.destroy({
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
    INSERT_SUCCESSFUL: 'db:image-type:insert:success',
    INSERT_ERROR: 'db:image-type:insert:error',
    UPDATE_SUCCESSFUL: 'db:image-type:update:success',
    UPDATE_ERROR: 'db:image-type:update:error',
    DELETE_SUCCESSFUL: 'db:image-type:delete:success',
    DELETE_ERROR: 'db:image-type:delete:error'
}
import Sequelize from 'sequelize'

export default (Action = (new Sequelize()).define(), Event = require('../events')) => {
    const raiseEvent = Event.raiseEvent

    if (!Action) throw new Error('Action parameter must be a valid sequelize model')
    if (!Event) throw new Error('Event parameter must be a valid EventEmitter instance')

    return {
        getAll(done) {
            return Action.findAll({}).then((actions) => done(null, actions)).catch(err => done(err))
        },
        getById(id, done) {
            return Action.findById(id, {}).then(data => done(null, data)).catch(err => done(err))
        },
        insert(data, done) {
            return Action.create(data, {}).then(savedData => raiseEvent(Events.CREATION_SUCCESSFUL, (data) => done(null, data), savedData))
                                            .catch(err => raiseEvent(Events.CREATION_ERROR, done, err))
        },
        update(data, done) {
            return Action.update(data, {
                where: {
                    id: data.id
                }
            }).then(affectedRows => Promise.resolve(this.getById(data.id, (err, obj) => {
                if (obj) raiseEvent(Events.UPDATE_SUCCESSFUL, (obj2) => done(null, obj2), obj)
                else raiseEvent(Events.UPDATE_ERROR, (err2) => done(err2), err)
            }))).catch(err => raiseEvent(Events.UPDATE_ERROR, done, err))
        },
        destroy(id, done) {
            return Action.destroy({
                where: {
                    id: id
                },
                paranoid: true
            }).then(data => done(null, data || true)).catch(err => done(err))
        }
    }
}

export const Events = {
    CREATION_SUCCESSFUL: 'db:action:creation:success',
    CREATION_ERROR: 'db:action:creation:error',
    UPDATE_SUCCESSFUL: 'db:action:update:success',
    UPDATE_ERROR: 'db:action:update:error',
    DELETE_SUCCESSFUL: 'db:action:delete:success',
    DELETE_ERROR: 'db:action:delete:error'
}
import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'user_type',
    attributes: {
        id: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        users: {
            collection: 'user',
            via: 'types'
        },
        roles: {
            collection: 'role',
            via: 'user_type_id'
        }
    },
    primaryKey: 'id'
})
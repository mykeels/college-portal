import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'user_type',
    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        users: {
            collection: 'user',
            via: 'types'
        },
        roles: {
            collection: 'role',
            via: 'user_type_id'
        }
    }
})
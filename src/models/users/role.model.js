import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'role',
    attributes: {
        id: {
            type: 'number',
            required: true
        },
        user_type_id: {
            model: 'user_type'
        },
        name: {
            type: 'string',
            required: true
        }
    },
    primaryKey: 'id'
})
import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'action',
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
        },
        description: {
            type: 'string'
        }
    },
    primaryKey: 'id'
})
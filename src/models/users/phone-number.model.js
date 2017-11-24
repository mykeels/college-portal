import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'phone_number',
    attributes: {
        id: {
            type: 'number',
            required: true
        },
        user_id: {
            model: 'user'
        },
        phone: {
            type: 'string',
            required: true
        },
        creation_date: {
            type: 'ref',
            autoCreatedAt: true
        },
        active: {
            type: 'boolean'
        }
    },
    primaryKey: 'id'
})
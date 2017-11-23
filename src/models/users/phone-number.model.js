import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'phone_number',
    attributes: {
        user_id: {
            model: 'user'
        },
        phone: {
            type: 'string',
            required: true
        },
        creation_date: {
            type: 'datetime',
            defaultsTo: () => (new Date())
        },
        active: {
            type: 'boolean'
        }
    }
})
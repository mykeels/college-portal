import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'role',
    attributes: {
        user_type_id: {
            model: 'user_type'
        },
        name: {
            type: 'string',
            required: true,
            unique: true
        }
    }
})
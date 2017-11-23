import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'user',
    attributes: {
        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true
        },
        pwd: {
            type: 'string',
            required: true
        },
        creation_date: {
            type: 'datetime',
            defaultsTo: () => (new Date())
        },
        gender: {
            type: 'string',
            enum: ['male', 'female']
        },
        phones: { //one-to-many relationship with 'phone_number'
            collection: 'phone_number',
            via: 'user_id'
        },
        types: { //many-to-many relationship with 'user'
            collection: 'user_type',
            via: 'users',
            dominant: true
        }
    }
})
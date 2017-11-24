import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'user',
    attributes: {
        id: {
            type: 'number',
            required: true
        },
        email: {
            type: 'string',
            required: true
        },
        pwd: {
            type: 'string',
            required: true
        },
        creation_date: {
            type: 'ref',
            autoCreatedAt: true
        },
        gender: {
            type: 'string',
            required: true
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
    },
    beforeCreate(values, next) {
        const bcrypt = require('bcrypt')

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err)

            bcrypt.hash(values.pwd, salt, (err, hash) => {
                if (err) return next(err)

                values.pwd = hash
                next()
            })
        })
    },
    primaryKey: 'id'
})
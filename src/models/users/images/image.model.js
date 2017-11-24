import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'image',
    attributes: {
        id: {
            type: 'number',
            required: true
        },
        image_type: {
            model: 'image_type'
        },
        name: {
            type: 'string',
            required: true
        },
        location: {
            type: 'string',
            required: true
        },
        active: {
            type: 'boolean',
            required: true
        }
    },
    primaryKey: 'id'
})
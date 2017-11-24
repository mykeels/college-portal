import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'image_type',
    attributes: {
        id: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        images: {
            collection: 'image',
            via: 'image_type'
        }
    },
    primaryKey: 'id'
})
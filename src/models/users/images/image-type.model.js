import Waterline from 'waterline'

export default Waterline.Collection.extend({
    identity: 'image_type',
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        images: {
            collection: 'image',
            via: 'image_type'
        }
    }
})
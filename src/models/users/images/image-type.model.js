import Sequelize from 'sequelize'
import Image from './image.model'

const ImageType = Sequelize.define('image_type', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    width: Sequelize.NUMBER,
    height: Sequelize.NUMBER
})

ImageType.hasMany(Image, {
    as: 'images'
})

export default ImageType
import Sequelize from 'sequelize'

export default (sequelize) => {
    const ImageType = sequelize.define('image_type', {
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
    
    return ImageType
}
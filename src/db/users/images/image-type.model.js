import Sequelize from 'sequelize'

export default (sequelize) => {
    const ImageType = sequelize.define('image_type', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        width: Sequelize.INTEGER,
        height: Sequelize.INTEGER
    })
    
    return ImageType
}
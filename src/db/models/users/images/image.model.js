/**
 * Users can have images
 */

import Sequelize from 'sequelize'

export default (sequelize, User, ImageType) => {
    const Image = sequelize.define('image', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    })
    
    Image.belongsTo(User)
    
    Image.belongsTo(ImageType, {
        as: 'type'
    })
    
    return Image
}
import Sequelize from 'sequelize'

export default (sequelize) => {
    const UserType = sequelize.define('user_type', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    
    return UserType
}
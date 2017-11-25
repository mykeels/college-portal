import Sequelize from 'sequelize'

export default (sequelize, UserType) => {
    const Role = sequelize.define('role', {
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
    
    Role.belongsTo(UserType)

    return Role
}
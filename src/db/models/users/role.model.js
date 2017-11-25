import Sequelize from 'sequelize'

export default (sequelize, UserType, Action) => {
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
    
    Role.hasMany(Action, {
        as: 'actions'
    })

    return Role
}
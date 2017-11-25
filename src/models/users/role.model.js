import Sequelize from 'sequelize'

export default (sequelize, UserType, Action) => {
    const Role = sequelize.define('role', {
        id: {
            type: Sequelize.NUMBER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    
    Role.belongsTo(UserType, {
        as: 'user_type'
    })
    
    Role.hasMany(Action, {
        as: 'actions'
    })

    return Role
}
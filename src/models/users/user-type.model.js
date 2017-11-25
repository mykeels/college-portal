import Sequelize from 'sequelize'
import User from './user.model'
import Role from './role.model'

const UserType = Sequelize.define('user_type', {
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

UserType.hasMany(User, {
    as: 'users'
})

UserType.hasMany(Role, {
    as: 'roles'
})

export default UserType
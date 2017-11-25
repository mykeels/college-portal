import Sequelize from 'sequelize'
import UserType from './user-type.model'
import Action from './action.model'

const Role = Sequelize.define('role', {
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

export default Role
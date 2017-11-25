import Sequelize from 'sequelize'
import UserType from './user-type.model'

export default Sequelize.define('action', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING
    }
})
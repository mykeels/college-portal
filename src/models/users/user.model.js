import Sequelize from 'sequelize'
import PhoneNumber from './phone-number.model'

const User = Sequelize.define('user', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    pwd: {
        type: Sequelize.STRING,
        allowNull: false
    },
    creation_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    gender: {
        type: Sequelize.ENUM,
        values: ['male', 'female']
    },
    types: { //many-to-many relationship with 'user'
        collection: 'user_type',
        via: 'users',
        dominant: true
    }
})

User.hasMany(PhoneNumber, {
    as: 'phones'
})

export default User
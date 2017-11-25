import Sequelize from 'sequelize'

export default (sequelize, PhoneNumber, UserType) => {
    const User = sequelize.define('user', {
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
    
    User.hasMany(UserType, {
        as: 'types'
    })
    
    return User
}
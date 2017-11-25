import Sequelize from 'sequelize'

export default (sequelize = new Sequelize(), PhoneNumber) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
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
        }
    })
    
    User.hasMany(PhoneNumber, {
        as: 'phones'
    })
    
    return User
}
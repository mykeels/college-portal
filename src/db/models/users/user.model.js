/**
 * A User symbolizes an Entity  that has login credentials, roles, and can perform actions within the system
 */

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
        gender: {
            type: Sequelize.ENUM,
            values: ['male', 'female']
        }
    })

    /**
     * A User may have more than one phone-number, each of which is a potential login credential
     */
    
    User.hasMany(PhoneNumber, {
        as: 'phones',
        foreignKeyConstraint: true
    })
    
    return User
}
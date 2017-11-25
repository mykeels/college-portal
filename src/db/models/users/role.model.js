/**
 * A Role is a tag or label that means a User is able to define a set of Actions 
 * defined within the Role. 
 * 
 * E.g. the HOD Role means that a Staff can approve results on behalf of a department he/she is the HOD of.
 */

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
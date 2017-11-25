/**
 * Allows for many-to-many relationship between User and Role
 */

import Sequelize from 'sequelize'

export default (sequelize = new Sequelize(), User, Role) => {
    const UserHasRole = sequelize.define('user_has_role', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    })
    
    UserHasRole.belongsTo(User)
    UserHasRole.belongsTo(Role)
    
    return UserHasRole
}
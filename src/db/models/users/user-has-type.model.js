import Sequelize from 'sequelize'

export default (sequelize = new Sequelize(), User, UserType) => {
    const UserHasType = sequelize.define('user_has_type', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    })
    
    UserHasType.belongsTo(User)
    UserHasType.belongsTo(UserType)
    
    return UserHasType
}
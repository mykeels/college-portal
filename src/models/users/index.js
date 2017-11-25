import User from './user.model'
import UserType from './user-type.model'
import Role from './role.model'
import PhoneNumber from './phone-number.model'
import Action from './action.model'
import Image from './images/image.model'
import ImageType from './images/image-type.model'

export default (sequelize) => {
    return {
        User: User(sequelize),
        UserType: UserType(sequelize),
        Role: Role(sequelize),
        PhoneNumber: PhoneNumber(sequelize),
        Action: Action(sequelize),
        Image: Image(sequelize),
        ImageType: ImageType(sequelize)
    }
}
import GetUser from './user.model'
import GetUserType from './user-type.model'
import GetRole from './role.model'
import GetPhoneNumber from './phone-number.model'
import GetAction from './action.model'
import GetImage from './images/image.model'
import GetImageType from './images/image-type.model'

export default (sequelize) => {
    const PhoneNumber = GetPhoneNumber(sequelize)
    const UserType = GetUserType(sequelize)
    const User = GetUser(sequelize, PhoneNumber, UserType)
    const Action = GetAction(sequelize)
    const Role = GetRole(sequelize, UserType, Action)
    const Image = GetImage(sequelize, User, ImageType)
    const ImageType = GetImageType(sequelize)

    return {
        User,
        UserType,
        Role,
        PhoneNumber,
        Action,
        Image,
        ImageType
    }
}